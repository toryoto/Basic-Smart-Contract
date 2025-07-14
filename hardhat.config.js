require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");
require("solidity-coverage");

task("deploy", "Deploy contracts")
  .addFlag("simpleAccountFactory", "deploy sample factory (by default, enabled only on localhost)");

function getNetwork1(url) {
  const secretKey = process.env.SECRET_KEY;
  return {
    url,
    accounts: [secretKey]
  };
}

function getNetwork(name) {
  return getNetwork1(`https://${name}.infura.io/v3/${process.env.INFURA_ID}`);
}

const config = {
  solidity: {
    compilers: [
      {
        version: "0.5.16"
      },
      {
        version: "0.8.28",
        optimizer: { enabled: true, runs: 1000000 }
      }
    ],
  },
  networks: {
    sepolia: getNetwork("sepolia")
  },
  mocha: {
    timeout: 10000
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

if (process.env.COVERAGE != null) {
  config.solidity = config.solidity.compilers[0];
}

module.exports = config;