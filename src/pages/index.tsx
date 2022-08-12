import { ContractReceipt, ContractTransaction, ethers, Event } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback } from "react";
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

  return (
    <>
      <Head>
        <title>Moonbirds mover</title>
        <meta name="description" content="moonbirds unnest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        {!connected && <button onClick={handleConnect}>Connect</button>}
        {connected && <button onClick={handleAllow}>Allow</button>}
        {connected && <button onClick={handleUnnest}>Allow</button>}
      </main>
    </>
  );
};

export default Home;
