import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "~/constants/contracts";

export const isTokenOwner = async (
  tokenId: number,
  address: string,
  provider: JsonRpcProvider,
  chainId: number,
): Promise<boolean> => {
  if (!tokenId || !address || !provider) {
    throw new Error("BAD_REQUEST");
  }
  try {
    const nftContract = new ethers.Contract(
      CONTRACT_ADDRESSES[chainId || 4] || "",
      CONTRACT_ABI,
      provider,
    );
    const response: BigNumber = await nftContract["balanceOf"]();
    const isTokenOwner = response.gt(0);
    return isTokenOwner;
  } catch (e) {
    console.warn("token owner check");
    console.warn(e);
    return false;
  }
};

export const getTokenByAddress = async (
  address: string,
  provider: JsonRpcProvider,
  chainId: number,
): Promise<number | undefined> => {
  if (!address || !provider) {
    throw new Error("BAD_REQUEST");
  }

  const nftContract = new ethers.Contract(
    CONTRACT_ADDRESSES[chainId || 4] || "",
    CONTRACT_ABI,
    provider,
  );

  try {
    const response: BigNumber[] = await nftContract["tokensOfOwner"](address);
    if (!response || !response[0]) return;
    return parseInt(response[0].toString());
  } catch (e) {
    console.warn("getTokenByAddress error");
    console.warn(e);
    return;
  }
};
