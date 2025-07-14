const hre = require("hardhat");

async function main() {
  try {
    const TokenVaultFactory = await hre.ethers.getContractFactory("TokenVault");
    const tokenVaultFactory = await TokenVaultFactory.deploy("0x7F594ABa4E1B6e137606a8fBAb5387B90C8DEEa9");
    await tokenVaultFactory.waitForDeployment();

    const tokenVaultFactoryAddress = await tokenVaultFactory.getAddress();
    
    console.log("ERC4626 Token Vault deployed to:", tokenVaultFactoryAddress);
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});