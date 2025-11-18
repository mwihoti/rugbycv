import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true
    }
  },
  networks: {
    moonbase: {
      url: "https://rpc.api.moonbase.moonbeam.network",
      chainId: 1287,
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 1000000000, // 1 gwei
    },
    moonbeam: {
      url: "https://rpc.api.moonbeam.network",
      chainId: 1284,
      accounts: [process.env.PRIVATE_KEY!],
    }
  },
  etherscan: {
    apiKey: { moonbaseAlpha: "abc" }, // dummy, just to make verify work
    customChains: [
      {
        network: "moonbaseAlpha",
        chainId: 1287,
        urls: {
          apiURL: "https://api-moonbase.moonscan.io/api",
          browserURL: "https://moonbase.moonscan.io/"
        }
      }
    ]
  }
};

export default config;
