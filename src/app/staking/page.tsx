"use client";

import ConnectEternlButton from "@/components/connectEternlButton";
import CryptoJS from "crypto-js";
import { useState } from "react";
import { initLucid } from "@/lib/lucid";

export default function StakingPage() {
  const [walletName, setWalletName] = useState("");
  const [adaAmount, setAdaAmount] = useState("5");
  const [pob, setPob] = useState("");
  const [output, setOutput] = useState("");

  const stake = async () => {
    setOutput("");
    const amountNum = Number(adaAmount);
    if (!walletName) {
      setOutput("❌ Please enter your wallet name.");
      return;
    }
    if (isNaN(amountNum) || amountNum < 5) {
      setOutput("❌ Minimum stake is 5 ADA.");
      return;
    }
    if (!pob || pob.length < 10) {
      setOutput("❌ Please provide a valid Proof of Backup (pob).");
      return;
    }

    let wallets: any[] = [];
    try {
      const stored = localStorage.getItem("wallets");
      wallets = JSON.parse(stored || "[]");
      if (!Array.isArray(wallets)) throw new Error();
    } catch {
      setOutput("❌ Could not read wallets from storage.");
      return;
    }

    const wallet = wallets.find((w) => w.walletName === walletName);
    if (!wallet) {
      setOutput("❌ Wallet name not found.");
      return;
    }

    const computedPob = CryptoJS.SHA256(wallet.encrypted).toString();

    if (computedPob !== pob) {
      setOutput("❌ Proof of Backup does not match this wallet.");
      return;
    }

    // try {
    //   setOutput("⏳ Building transaction...");
    //   const lucid = await initLucid();
    //   const amountLovelace = BigInt(amountNum * 1_000_000);

    //   const tx = await lucid
    //     .newTx()
    //     .pay.ToAddress(APP_WALLET_ADDRESS, { lovelace: amountLovelace })
    //     .complete();

    //   setOutput("⏳ Awaiting wallet signature...");
    //   const signedTx = await tx.sign.withWallet().complete;

    //   setOutput("⏳ Submitting transaction...");
    //   const txHash = await signedTx.apply;

    //   setOutput(`✅ Staked! Tx Hash: ${txHash}`);
    // } catch (err: any) {
    //   setOutput("❌ Transaction failed: " + (err?.message || String(err)));
    // }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <ConnectEternlButton />
        <div>
          <label className="block mb-2 font-semibold">Wallet Name</label>
          <input
            type="text"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            placeholder="Enter your wallet name"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">
            Proof of Backup (PoB)
          </label>
          <input
            type="text"
            value={pob}
            onChange={(e) => setPob(e.target.value)}
            placeholder="Paste pob from your encrypted wallet"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">
            Amount to Stake (min 5 ADA)
          </label>
          <input
            type="number"
            min={5}
            step={1}
            value={adaAmount}
            onChange={(e) => setAdaAmount(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          />
        </div>
        <button
          onClick={stake}
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        >
          Stake ADA
        </button>
        {output && <div className="mt-4 text-sm">{output}</div>}
      </div>
    </main>
  );
}
