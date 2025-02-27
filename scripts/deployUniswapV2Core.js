const hre = require("hardhat");

async function main() {
  try {
    const feeToSetterAddress = "0xb272ec9B463564b7813c4b4F7d2F6bec83728b15";

    const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
    const uniswapFactory = await UniswapV2Factory.deploy(feeToSetterAddress);  
    console.log("UniswapV2Factory deployed to:", uniswapFactory.address);
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});