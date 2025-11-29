const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Verify deployed contracts on Etherscan
 * Usage: npx hardhat run scripts/verify.js --network sepolia
 */

async function main() {
  console.log("🔍 Starting contract verification...\n");

  // Find the latest deployment file
  const deploymentsDir = "./deployments";
  
  if (!fs.existsSync(deploymentsDir)) {
    console.error("❌ No deployments directory found!");
    console.error("   Please deploy contracts first using: npm run deploy:sepolia");
    process.exit(1);
  }

  const files = fs.readdirSync(deploymentsDir)
    .filter(f => f.startsWith(hre.network.name) && f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error(`❌ No deployment files found for network: ${hre.network.name}`);
    console.error("   Please deploy contracts first.");
    process.exit(1);
  }

  const deploymentFile = path.join(deploymentsDir, files[0]);
  console.log(`📄 Using deployment file: ${files[0]}\n`);

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));

  // Extract addresses
  const { DataRegistry, PaymentProcessor, ResearchOracle } = deployment.contracts;
  const { queryFee, platformWallet } = deployment.configuration;

  console.log("Contract Addresses:");
  console.log(`├─ DataRegistry:     ${DataRegistry}`);
  console.log(`├─ PaymentProcessor: ${PaymentProcessor}`);
  console.log(`└─ ResearchOracle:   ${ResearchOracle}\n`);

  // Verify DataRegistry
  console.log("1️⃣ Verifying DataRegistry...");
  try {
    await hre.run("verify:verify", {
      address: DataRegistry,
      constructorArguments: [],
    });
    console.log("✅ DataRegistry verified successfully\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  DataRegistry already verified\n");
    } else {
      console.error("❌ DataRegistry verification failed:", error.message, "\n");
    }
  }

  // Verify PaymentProcessor
  console.log("2️⃣ Verifying PaymentProcessor...");
  try {
    await hre.run("verify:verify", {
      address: PaymentProcessor,
      constructorArguments: [DataRegistry, platformWallet],
    });
    console.log("✅ PaymentProcessor verified successfully\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  PaymentProcessor already verified\n");
    } else {
      console.error("❌ PaymentProcessor verification failed:", error.message, "\n");
    }
  }

  // Verify ResearchOracle
  console.log("3️⃣ Verifying ResearchOracle...");
  try {
    await hre.run("verify:verify", {
      address: ResearchOracle,
      constructorArguments: [DataRegistry, PaymentProcessor, queryFee],
    });
    console.log("✅ ResearchOracle verified successfully\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  ResearchOracle already verified\n");
    } else {
      console.error("❌ ResearchOracle verification failed:", error.message, "\n");
    }
  }

  console.log("=".repeat(60));
  console.log("✨ Verification process complete!");
  console.log("=".repeat(60));
  console.log("\n📍 View contracts on Etherscan:");
  console.log(`   DataRegistry:     https://${hre.network.name}.etherscan.io/address/${DataRegistry}`);
  console.log(`   PaymentProcessor: https://${hre.network.name}.etherscan.io/address/${PaymentProcessor}`);
  console.log(`   ResearchOracle:   https://${hre.network.name}.etherscan.io/address/${ResearchOracle}`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:");
    console.error(error);
    process.exit(1);
  });