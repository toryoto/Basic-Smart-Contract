require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");
require("solidity-coverage");

task("deploy", "Deploy contracts")
  .addFlag("simpleAccountFactory", "deploy sample factory (by default, enabled only on localhost)");

const config = {
  solidity: {
    compilers: [
      {
        version: "0.5.16"
      },
      {
        version: "0.8.9",
        optimizer: { enabled: true, runs: 1000000 }
      },
      {
        version: "0.8.28",
        optimizer: { enabled: true, runs: 1000000 }
      }
    ],
  },
  networks: {
    hardhat: {
      // ローカルテスト用
    }
  },
  mocha: {
    timeout: 10000
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

// 環境変数が存在する場合のみSepoliaネットワークを追加
if (process.env.SECRET_KEY && process.env.INFURA_ID) {
  config.networks.sepolia = {
    url: `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`,
    accounts: [process.env.SECRET_KEY]
  };
}

if (process.env.COVERAGE != null) {
  config.solidity = config.solidity.compilers[0];
}

module.exports = config;