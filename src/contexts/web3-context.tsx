import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { IFrameEthereumProvider } from "@ledgerhq/iframe-provider";
import { networks } from "../constants/networks";
import { Web3ContextData } from "./web3-context-types";
import { isIframe } from "../helpers/browser";
import { signMessage } from "../helpers/signatures";
import { AUTHORIZATON_MESSAGE } from "../constants/strings";

export const Web3Context = createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " +
        "please declare it at a higher level.",
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [onChainProvider]);
};

// const saveNetworkId = (NetworkId: number) => {
//   if (window.localStorage) {
//     window.localStorage.setItem("defaultNetworkId", NetworkId.toString());
//   }
// };

// const getSavedNetworkId = () => {
//   const savedNetworkId =
//     window.localStorage && window.localStorage.getItem("defaultNetworkId");
//   if (savedNetworkId) {
//     return parseInt(savedNetworkId);
//   }
//   return null;
// };

const saveSignature = (signature: string) => {
  if (window.localStorage) {
    window.localStorage.setItem("signature", signature);
  }
};

export const getSavedSignature = () => {
  if (typeof window === "undefined" || !window?.localStorage) return;
  const signature =
    window.localStorage && window.localStorage.getItem("signature");
  if (signature) {
    return signature;
  }
  return null;
};

export const Web3ContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [connected, setConnected] = useState(false);

  const defaultNetworkId = 4;
  const [chainId, setChainId] = useState(defaultNetworkId);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
  const [signature, setSignature] = useState<string>();

  const rpcUris = Object.entries(networks).map(([networkId, networkData]) => ({
    [networkId]: networkData.rpcUrls[0],
  }));

  const web3Modal: Web3Modal | undefined = useMemo(() => {
    return typeof window !== "undefined"
      ? new Web3Modal({
          cacheProvider: true, // optional
          providerOptions: {
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                rpc: rpcUris,
              },
            },
          },
        })
      : undefined;
  }, [rpcUris]);

  const hasCachedProvider = useCallback((): boolean => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  }, [web3Modal]);

  const disconnect = useCallback(async () => {
    if (!web3Modal || !provider || !connected) return;
    web3Modal.clearCachedProvider();
    setConnected(false);
    setSignature("");
    saveSignature("");

    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  const initListeners = useCallback(
    (provider: any) => {
      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts: string[]) => {
        if (!!accounts[0] && accounts[0] !== address) {
          setAddress(accounts[0]);
          setSignature("");
          saveSignature("");
        }
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (newChainId: string | number) => {
        if (newChainId && typeof newChainId === "string") {
          setChainId(parseInt(newChainId, 16));
        } else if (newChainId && typeof newChainId === "number") {
          setChainId(newChainId);
        }
      });

      // Subscribe to provider connection
      provider.on("connect", (info: { chainId: number }) => {
        console.log(info);
      });

      // Subscribe to provider disconnection
      provider.on("disconnect", (error: { code: number; message: string }) => {
        console.log(error);
        disconnect();
      });
    },
    [address, disconnect],
  );

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    if (!web3Modal) return;
    // handling Ledger Live;
    let rawProvider;
    if (isIframe()) {
      rawProvider = new IFrameEthereumProvider();
    } else {
      rawProvider = await web3Modal.connect();
    }

    const connectedProvider = new Web3Provider(rawProvider, "any");
    initListeners(rawProvider);
    const chainId = await connectedProvider
      .getNetwork()
      .then((network) => network.chainId);
    const connectedAddress = await connectedProvider.getSigner().getAddress();

    setChainId(chainId);
    setAddress(connectedAddress);
    setProvider(connectedProvider);

    // Keep this at the bottom of the method, to ensure any repaints have the data we need
    setConnected(true);

    return connectedProvider;
  }, [web3Modal, initListeners]);

  const sign = useCallback(async () => {
    if (!provider) return;
    const savedSignature = getSavedSignature();
    if (!!savedSignature && savedSignature !== "") {
      setSignature(savedSignature);
    } else {
      const newSignature = await signMessage(provider, AUTHORIZATON_MESSAGE);
      saveSignature(newSignature);
      setSignature(newSignature);
    }
  }, [provider]);

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainId,
      web3Modal,
      sign,
      signature,
    }),
    [
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainId,
      web3Modal,
      sign,
      signature,
    ],
  );

  return (
    <Web3Context.Provider value={{ onChainProvider }}>
      {children}
    </Web3Context.Provider>
  );
};
