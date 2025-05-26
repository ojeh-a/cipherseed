'use client';

import { Lucid, Blockfrost, WalletApi } from "@lucid-evolution/lucid";

let lucid: Awaited<ReturnType<typeof Lucid>>;

export const initLucid = async () => {
    const eternl = window.cardano?.eternl;
    if (!eternl) throw new Error("Eternl wallet not found.");

    const walletApi: WalletApi = await eternl.enable();

    const blockfrostApiKey = "preprodT70f78P4qEWkten5BcASVloJs2XlmXqm";

    lucid = await Lucid(new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", blockfrostApiKey), "Preprod");

    lucid.selectWallet.fromAPI(walletApi);

    return lucid;
}

export const getLucid = () => {
    if (!lucid) throw new Error("Lucid not initialized");
    return lucid;
};