"use client";

import { Lucid, Blockfrost, WalletApi } from "@lucid-evolution/lucid";

let lucidInstance: Awaited<ReturnType<typeof Lucid>> | null = null;

export const initLucid = async (): Promise<
  Awaited<ReturnType<typeof Lucid>>
> => {

  const eternl = window.cardano?.eternl;
  if (!eternl) throw new Error("Please install Eternl wallet");

  
  const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_KEY;
  if (!blockfrostApiKey) throw new Error("Missing Blockfrost API key");

  try {
    const walletApi: WalletApi = await eternl.enable();

    const lucid = await Lucid(
      new Blockfrost(
        "https://cardano-preprod.blockfrost.io/api/v0",
        blockfrostApiKey,
      ),
      "Preprod"
    );

    lucid.selectWallet.fromAPI(walletApi);
    lucidInstance = lucid;

    return lucid;
  } catch (error) {
    console.error("Lucid initialization failed:", error);
    throw new Error(
      `Wallet connection failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const getLucid = (): Awaited<ReturnType<typeof Lucid>> => {
  if (!lucidInstance)
    throw new Error("Lucid not initialized. Call initLucid() first.");
  return lucidInstance;
};
