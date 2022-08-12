import { JsonRpcProvider } from "@ethersproject/providers";
import Web3Modal from "web3modal";

export type onChainProvider = {
  connect: (forceSwitch?: boolean, forceNetworkId?: number) => void;
  disconnect: () => void;
  provider: JsonRpcProvider | null;
  address: string;
  connected: boolean;
  web3Modal: Web3Modal | undefined;
  hasCachedProvider?: () => boolean;
  chainId?: number;
  switchEthereumChain?: (
    networkId: number,
    forceSwitch?: boolean,
  ) => Promise<boolean>;
  sign?: () => void;
  signature?: string;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;
