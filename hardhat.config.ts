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
    hardhat: {
      chainId: 31337,
      type: "http" as const,
      url: "http://127.0.0.1:8545",
    },
    moonbase: {
      type: "http" as const,
      url: "https://rpc.api.moonbase.moonbeam.network",
      chainId: 1287,
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 1000000000, // 1 gwei
    },
    moonbeam: {
      type: "http" as const,
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
