// scripts/deploy-usdc.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying USDC with the account:", deployer.address);
  
  const usdcInitialSupply = ethers.parseUnits("1000000", 6);
  const jpytInitialSupply = ethers.parseEther("150000000", 6);
  
  const CreateToken = await ethers.getContractFactory("Stablecoin");
  
  console.log("Deploying USDC...");
  const usdc = await CreateToken.deploy("USD Coin", "USDC", usdcInitialSupply, 6);
  await usdc.waitForDeployment();
  
  const usdcAddress = await usdc.getAddress();
  console.log("USDC deployed to:", usdcAddress);
  
  console.log("Verifying decimals...");
  const decimalsUsdc = await usdc.decimals();
  console.log("USDC decimals:", decimalsUsdc.toString());

  console.log("Deploying JPYT...");
  const jpyt = await CreateToken.deploy("Japanese Yen Token", "JPYT", jpytInitialSupply, 6);
  await jpyt.waitForDeployment();
  console.log("JPYT deployed to:", await jpyt.getAddress());
  
  console.log("Verifying decimals...");
  const decimalsJpyt = await jpyt.decimals();
  console.log("JPYT decimals:", decimalsJpyt.toString());
  
  const fs = require("fs");
  const deployData = {
    USDC: usdcAddress
  };
  fs.writeFileSync("deployed-usdc.json", JSON.stringify(deployData, null, 2));
  
  return { USDC: usdcAddress };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });