// scripts/deploy-tokens.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying tokens with the account:", deployer.address);
  
  const daiInitialSupply = ethers.parseEther("1000000"); // 100万DAI
  const usdcInitialSupply = ethers.parseUnits("1000000", 6); // 100万USDC (6桁精度)
  const jpytInitialSupply = ethers.parseEther("150000000"); // 1.5億JPYT
  
  const CreateToken = await ethers.getContractFactory("CreateToken");
  
  // DAIのデプロイ
  console.log("Deploying DAI...");
  const dai = await CreateToken.deploy("Dai Stablecoin", "DAI", daiInitialSupply);
  await dai.waitForDeployment();
  console.log("DAI deployed to:", await dai.getAddress());
  
  // USDCのデプロイ
  console.log("Deploying USDC...");
  const usdc = await CreateToken.deploy("USD Coin", "USDC", usdcInitialSupply);
  await usdc.waitForDeployment();
  console.log("USDC deployed to:", await usdc.getAddress());
  
  // JPYTのデプロイ
  console.log("Deploying JPYT...");
  const jpyt = await CreateToken.deploy("Japanese Yen Token", "JPYT", jpytInitialSupply);
  await jpyt.waitForDeployment();
  console.log("JPYT deployed to:", await jpyt.getAddress());
  
  console.log("All tokens deployed successfully!");
  
  const deployedTokens = {
    DAI: await dai.getAddress(),
    USDC: await usdc.getAddress(),
    JPYT: await jpyt.getAddress()
  };
  
  console.log("Deployed token addresses:", deployedTokens);
  
  const fs = require("fs");
  fs.writeFileSync("deployed-tokens.json", JSON.stringify(deployedTokens, null, 2));
  
  return deployedTokens;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });