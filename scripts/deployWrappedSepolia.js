const hre = require("hardhat");

async function main() {
  try {
    const TokenFactory = await hre.ethers.getContractFactory("WrappedSepolia");
    const tokenFactory = await TokenFactory.deploy();
    await tokenFactory.waitForDeployment();

    const tokenFactoryAddress = await tokenFactory.getAddress();
    
    console.log("WrappedSepolia deployed to:", tokenFactoryAddress);
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});