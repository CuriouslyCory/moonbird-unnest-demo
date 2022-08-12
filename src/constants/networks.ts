import { Networks, NetworkIds } from "./network-types";

export const networks: Networks = {
  [NetworkIds.Ethereum]: {
    name: "Ethereum Mainnet",
    networkId: NetworkIds.Ethereum,
    rpcUrls: [`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`],
    mainnet: true,
    openseaName: "ethereum",
  },
  [NetworkIds.Rinkeby]: {
    name: "Rinkeby Testnet",
    networkId: NetworkIds.Rinkeby,
    rpcUrls: [`https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`],
    mainnet: false,
    openseaName: "rinkeby",
  },
  [NetworkIds.Gorli]: {
    name: "Gorli Testnet",
    networkId: NetworkIds.Gorli,
    rpcUrls: [`https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`],
    mainnet: false,
  },
  [NetworkIds.Fantom]: {
    name: "Fantom Mainnet",
    networkId: NetworkIds.Fantom,
    rpcUrls: ["https://rpc.ftm.tools/"],
    mainnet: true,
  },
  [NetworkIds.Polygon]: {
    name: "Polygon Mainnet",
    networkId: NetworkIds.Polygon,
    rpcUrls: ["https://matic-mainnet-archive-rpc.bwarelabs.com"],
    mainnet: true,
    openseaName: "matic",
  },
  [NetworkIds.Mumbai]: {
    name: "Polygon Mumbai Testnet",
    networkId: NetworkIds.Mumbai,
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    mainnet: false,
  },
};
