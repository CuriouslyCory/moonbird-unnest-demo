import { isDev } from "~/helpers/environment";
import contractAbi from "../abi/mint-yourself.json";
import { NetworkIds } from "./network-types";

type ContractAddresses = {
  [key: number]: string;
};

export const CONTRACT_ADDRESSES: ContractAddresses = {
  [NetworkIds.Rinkeby]: "0x83340C155d76182F9EAd9E7D3E74647E7aA42ad9",
  [NetworkIds.Ethereum]: "0xE774A95551f9A9271B85d4E4718B6dd1FFb1aE89",
  [NetworkIds.Polygon]: "0xe0034D21089BD157a4a32C704c2f8361175F33a2",
};

export const CONTRACT_ABI = contractAbi;
