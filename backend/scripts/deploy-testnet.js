const hre = require("hardhat");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting BioMesh Testnet (Sepolia) Deployment...\n");

  // ============ Environment Validation ============
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not set in environment variables. Please set it before deploying.");
  }

  if (!process.env.ETHERSCAN_API_KEY && hre.network.name === "sepolia") {
    console.warn("⚠️  WARNING: ETHERSCAN_API_KEY not set. Contract verification will fail.\n");
  }

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  if (ethers.parseEther("0.5") > balance) {
    throw new Error("❌ Insufficient balance. You need at least 0.5 ETH to deploy.");
  }
  
  const networkInfo = await ethers.provider.getNetwork();
  console.log("🌐 Network:", hre.network.name);
  console.log("🔗 Chain ID:", networkInfo.chainId);
  console.log("");

  // ============ Deployment Parameters ============
  const queryFee = ethers.parseEther("0.01"); // 0.01 ETH per query
  const platformWallet = deployer.address; // Use deployer as platform wallet for testnet

  const deploymentStartTime = Date.now();

  // ============ Deploy DataRegistry ============
  console.log("📊 Deploying DataRegistry...");
  const DataRegistry = await ethers.getContractFactory("DataRegistry");
  const dataRegistry = await DataRegistry.deploy();
  const dataRegistryReceipt = await dataRegistry.waitForDeployment();
  const dataRegistryAddress = await dataRegistry.getAddress();
  const blockNumber1 = await ethers.provider.getBlockNumber();
  console.log("✅ DataRegistry deployed to:", dataRegistryAddress);
  console.log("   Block:", blockNumber1);
  console.log("");

  // ============ Deploy PaymentProcessor ============
  console.log("💳 Deploying PaymentProcessor...");
  const PaymentProcessor = await ethers.getContractFactory("PaymentProcessor");
  const paymentProcessor = await PaymentProcessor.deploy(
    dataRegistryAddress,
    platformWallet
  );
  const paymentProcessorReceipt = await paymentProcessor.waitForDeployment();
  const paymentProcessorAddress = await paymentProcessor.getAddress();
  const blockNumber2 = await ethers.provider.getBlockNumber();
  console.log("✅ PaymentProcessor deployed to:", paymentProcessorAddress);
  console.log("   Block:", blockNumber2);
  console.log("");

  // ============ Deploy ResearchOracle ============
  console.log("🔬 Deploying ResearchOracle...");
  const ResearchOracle = await ethers.getContractFactory("ResearchOracle");
  const researchOracle = await ResearchOracle.deploy(
    dataRegistryAddress,
    paymentProcessorAddress,
    queryFee
  );
  const researchOracleReceipt = await researchOracle.waitForDeployment();
  const researchOracleAddress = await researchOracle.getAddress();
  const blockNumber3 = await ethers.provider.getBlockNumber();
  console.log("✅ ResearchOracle deployed to:", researchOracleAddress);
  console.log("   Block:", blockNumber3);
  console.log("");

  // ============ Setup Permissions ============
  console.log("🔐 Setting up permissions...");
  
  try {
    // Authorize ResearchOracle in DataRegistry
    console.log("   Authorizing ResearchOracle in DataRegistry...");
    const authTx1 = await dataRegistry.authorizeOracle(researchOracleAddress);
    const authReceipt1 = await authTx1.wait();
    console.log("   ✅ ResearchOracle authorized in DataRegistry");
    console.log("   TX Hash:", authTx1.hash);

    // Authorize ResearchOracle in PaymentProcessor
    console.log("   Authorizing ResearchOracle in PaymentProcessor...");
    const authTx2 = await paymentProcessor.authorizeOracle(researchOracleAddress);
    const authReceipt2 = await authTx2.wait();
    console.log("   ✅ ResearchOracle authorized in PaymentProcessor");
    console.log("   TX Hash:", authTx2.hash);
  } catch (error) {
    console.warn("⚠️  Warning: Failed to authorize oracles:", error.message);
    console.warn("   This may happen if the contracts are already authorized or if methods don't exist.");
  }

  console.log("");

  // ============ Deployment Summary ============
  const deploymentDuration = Date.now() - deploymentStartTime;
  console.log("=".repeat(70));
  console.log("📋 SEPOLIA TESTNET DEPLOYMENT SUMMARY");
  console.log("=".repeat(70));
  console.log(`
Network:              ${hre.network.name}
Chain ID:             ${networkInfo.chainId}
Deployer Address:     ${deployer.address}
Deployment Duration:  ${(deploymentDuration / 1000).toFixed(2)}s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 SMART CONTRACT ADDRESSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DataRegistry:         ${dataRegistryAddress}
PaymentProcessor:     ${paymentProcessorAddress}
ResearchOracle:       ${researchOracleAddress}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️  CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Query Fee:            ${ethers.formatEther(queryFee)} ETH
Platform Wallet:      ${platformWallet}
Patient Share:        70%
Platform Share:       30%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 BLOCK EXPLORER LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DataRegistry:         https://sepolia.etherscan.io/address/${dataRegistryAddress}
PaymentProcessor:     https://sepolia.etherscan.io/address/${paymentProcessorAddress}
ResearchOracle:       https://sepolia.etherscan.io/address/${researchOracleAddress}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ✓ Verify contracts on Etherscan:
   npm run verify:sepolia

2. Update frontend .env file with contract addresses:
   REACT_APP_DATA_REGISTRY_ADDRESS=${dataRegistryAddress}
   REACT_APP_PAYMENT_PROCESSOR_ADDRESS=${paymentProcessorAddress}
   REACT_APP_RESEARCH_ORACLE_ADDRESS=${researchOracleAddress}

3. Fund test accounts:
   - Send Sepolia ETH from faucet to test accounts
   - Recommended: 1-2 ETH per test account for testing

4. Test contract interactions:
   - Submit encrypted health data
   - Execute research queries
   - Process payments

5. Monitor gas usage and optimize if needed
  `);
  console.log("=".repeat(70));
  console.log("");

  // ============ Save Deployment Information ============
  const deploymentInfo = {
    network: hre.network.name,
    chainId: Number(networkInfo.chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    deploymentDuration: `${(deploymentDuration / 1000).toFixed(2)}s`,
    contracts: {
      DataRegistry: {
        address: dataRegistryAddress,
        blockNumber: blockNumber1,
        type: "Core Data Storage",
      },
      PaymentProcessor: {
        address: paymentProcessorAddress,
        blockNumber: blockNumber2,
        type: "Payment & Earnings Management",
      },
      ResearchOracle: {
        address: researchOracleAddress,
        blockNumber: blockNumber3,
        type: "Encrypted Query Execution",
      },
    },
    configuration: {
      queryFee: queryFee.toString(),
      queryFeeETH: ethers.formatEther(queryFee),
      platformWallet: platformWallet,
      patientShare: "70%",
      platformShare: "30%",
    },
    blockExplorer: {
      baseUrl: "https://sepolia.etherscan.io",
      DataRegistry: `https://sepolia.etherscan.io/address/${dataRegistryAddress}`,
      PaymentProcessor: `https://sepolia.etherscan.io/address/${paymentProcessorAddress}`,
      ResearchOracle: `https://sepolia.etherscan.io/address/${researchOracleAddress}`,
    },
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = path.join(deploymentsDir, `sepolia-${timestamp}.json`);
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Deployment info saved to: ${filename}`);

  // Also save a "latest" file for quick reference
  const latestFilename = path.join(deploymentsDir, "sepolia-latest.json");
  fs.writeFileSync(latestFilename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Latest deployment saved to: ${latestFilename}\n`);

  // ============ Environment File Template ============
  const envTemplate = `# BioMesh Sepolia Testnet Configuration
# Copy this to your .env file and adjust as needed

# Sepolia RPC and API Keys
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

# Deployment Account
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE

# Frontend Environment Variables
REACT_APP_NETWORK_NAME=sepolia
REACT_APP_CHAIN_ID=11155111
REACT_APP_DATA_REGISTRY_ADDRESS=${dataRegistryAddress}
REACT_APP_PAYMENT_PROCESSOR_ADDRESS=${paymentProcessorAddress}
REACT_APP_RESEARCH_ORACLE_ADDRESS=${researchOracleAddress}
REACT_APP_QUERY_FEE=${ethers.formatEther(queryFee)}

# Gateway Configuration (if using Zama fhEVM)
REACT_APP_GATEWAY_URL=https://gateway.zama.ai
REACT_APP_COPROCESSOR_URL=https://coprocessor.zama.ai
`;

  const envTemplateFilename = path.join(deploymentsDir, "sepolia-.env.template");
  fs.writeFileSync(envTemplateFilename, envTemplate);
  console.log(`📄 Environment template saved to: ${envTemplateFilename}`);
  console.log(`   Copy this to your .env file and update with your keys\n`);

  return {
    dataRegistry,
    paymentProcessor,
    researchOracle,
    addresses: {
      dataRegistry: dataRegistryAddress,
      paymentProcessor: paymentProcessorAddress,
      researchOracle: researchOracleAddress,
    },
    configuration: {
      queryFee: queryFee.toString(),
      platformWallet,
    },
  };
}

// Execute deployment
main()
  .then((result) => {
    console.log("✅ Deployment completed successfully!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    
    if (error.message.includes("PRIVATE_KEY")) {
      console.error("\n💡 Hint: Make sure you have PRIVATE_KEY set in your .env file");
    } else if (error.message.includes("insufficient balance")) {
      console.error("\n💡 Hint: Get Sepolia ETH from: https://sepoliafaucet.com");
    } else if (error.message.includes("network")) {
      console.error("\n💡 Hint: Check your SEPOLIA_RPC_URL in .env file");
    }
    
    process.exit(1);
  });

module.exports = { main };
