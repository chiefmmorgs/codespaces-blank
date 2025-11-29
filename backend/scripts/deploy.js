const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting BioMesh deployment...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deployment parameters
  const queryFee = ethers.parseEther("0.01"); // 0.01 ETH per query
  const platformWallet = deployer.address; // Use deployer as platform wallet for testing

  // ============ Deploy DataRegistry ============
  console.log("📊 Deploying DataRegistry...");
  const DataRegistry = await ethers.getContractFactory("DataRegistry");
  const dataRegistry = await DataRegistry.deploy();
  await dataRegistry.waitForDeployment();
  const dataRegistryAddress = await dataRegistry.getAddress();
  console.log("✅ DataRegistry deployed to:", dataRegistryAddress);

  // ============ Deploy PaymentProcessor ============
  console.log("\n💳 Deploying PaymentProcessor...");
  const PaymentProcessor = await ethers.getContractFactory("PaymentProcessor");
  const paymentProcessor = await PaymentProcessor.deploy(
    dataRegistryAddress,
    platformWallet
  );
  await paymentProcessor.waitForDeployment();
  const paymentProcessorAddress = await paymentProcessor.getAddress();
  console.log("✅ PaymentProcessor deployed to:", paymentProcessorAddress);

  // ============ Deploy ResearchOracle ============
  console.log("\n🔬 Deploying ResearchOracle...");
  const ResearchOracle = await ethers.getContractFactory("ResearchOracle");
  const researchOracle = await ResearchOracle.deploy(
    dataRegistryAddress,
    paymentProcessorAddress,
    queryFee
  );
  await researchOracle.waitForDeployment();
  const researchOracleAddress = await researchOracle.getAddress();
  console.log("✅ ResearchOracle deployed to:", researchOracleAddress);

  // ============ Setup Permissions ============
  console.log("\n🔐 Setting up permissions...");
  
  // Authorize ResearchOracle in DataRegistry
  console.log("   Authorizing ResearchOracle in DataRegistry...");
  const authTx1 = await dataRegistry.authorizeOracle(researchOracleAddress);
  await authTx1.wait();
  console.log("   ✅ ResearchOracle authorized in DataRegistry");

  // Authorize ResearchOracle in PaymentProcessor
  console.log("   Authorizing ResearchOracle in PaymentProcessor...");
  const authTx2 = await paymentProcessor.authorizeOracle(researchOracleAddress);
  await authTx2.wait();
  console.log("   ✅ ResearchOracle authorized in PaymentProcessor");

  // ============ Deployment Summary ============
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log(`
Network:           ${hre.network.name}
Chain ID:          ${(await ethers.provider.getNetwork()).chainId}
Deployer:          ${deployer.address}

Contract Addresses:
├─ DataRegistry:        ${dataRegistryAddress}
├─ PaymentProcessor:    ${paymentProcessorAddress}
└─ ResearchOracle:      ${researchOracleAddress}

Configuration:
├─ Query Fee:           ${ethers.formatEther(queryFee)} ETH
├─ Platform Wallet:     ${platformWallet}
└─ Patient Share:       70%

Next Steps:
1. Verify contracts on Etherscan (run: npm run verify:sepolia)
2. Update frontend .env with contract addresses
3. Test with sample data submission
4. Fund test accounts for queries
  `);
  console.log("=".repeat(60));

  // Save deployment info to file
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      DataRegistry: dataRegistryAddress,
      PaymentProcessor: paymentProcessorAddress,
      ResearchOracle: researchOracleAddress,
    },
    configuration: {
      queryFee: queryFee.toString(),
      platformWallet: platformWallet,
    },
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filename = `${deploymentsDir}/${hre.network.name}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${filename}\n`);

  return {
    dataRegistry,
    paymentProcessor,
    researchOracle,
    addresses: {
      dataRegistry: dataRegistryAddress,
      paymentProcessor: paymentProcessorAddress,
      researchOracle: researchOracleAddress,
    },
  };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

module.exports = { main };