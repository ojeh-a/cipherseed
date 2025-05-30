"use client";

import { Lucid, Blockfrost, WalletApi } from "@lucid-evolution/lucid";

let lucidInstance: Awaited<ReturnType<typeof Lucid>> | null = null;

export const initLucid = async (): Promise<
  Awaited<ReturnType<typeof Lucid>>
> => {
  // 1. Wallet Detection
  const eternl = window.cardano?.eternl;
  if (!eternl) throw new Error("Please install Eternl wallet");

  // 2. Environment Validation
  const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_KEY;
  if (!blockfrostApiKey) throw new Error("Missing Blockfrost API key");

  try {
    // 3. Wallet Enable
    const walletApi: WalletApi = await eternl.enable();

    // 4. Correct Lucid Initialization (FIXED LINE 37)
    const lucid = await Lucid(
      new Blockfrost(
        "https://cardano-preprod.blockfrost.io/api/v0",
        blockfrostApiKey
      ),
      "Preprod"
    );

    // 5. Wallet Connection (FIXED - Using selectWallet properly)
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
