const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying InitiativeRegistry contract...");

  // Get the contract factory
  const InitiativeRegistry = await ethers.getContractFactory("InitiativeRegistry");

  // Deploy the contract
  const initiativeRegistry = await InitiativeRegistry.deploy();

  // Wait for deployment to complete
  await initiativeRegistry.waitForDeployment();

  const contractAddress = await initiativeRegistry.getAddress();

  console.log("InitiativeRegistry deployed to:", contractAddress);
  console.log("Transaction hash:", initiativeRegistry.deploymentTransaction().hash);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    transactionHash: initiativeRegistry.deploymentTransaction().hash,
  };

  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));

  // Verify contract on block explorer (if not local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await initiativeRegistry.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
