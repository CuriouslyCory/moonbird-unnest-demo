import { JsonRpcProvider } from "@ethersproject/providers";

export const signMessage = async (
  provider: JsonRpcProvider,
  message: string,
) => {
  return await provider.getSigner().signMessage(message);
};
