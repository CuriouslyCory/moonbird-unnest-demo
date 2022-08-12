export type Network = {
  name: string;
  networkId: NetworkIds;
  rpcUrls: string[];
  mainnet: boolean;
  openseaName?: string;
};

export type Networks = {
  [networkId: string]: Network;
};

export enum NetworkIds {
  Ethereum = 1,
  Rinkeby = 4,
  Gorli = 5,
  Fantom = 250,
  Polygon = 137,
  Mumbai = 80001,
}
