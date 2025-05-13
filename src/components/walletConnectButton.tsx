"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    cardano?: any;
  }
}

export default function WalletConnectButton() {
  const [connected, setConnected] = useState(false);
  const [walletName, setWalletName] = useState("Connect Wallet");

  const connectWallet = async () => {
    try {
      const eternl = window.cardano?.eternl;
      if (!eternl) {
        alert("Eternl wallet not found");
        return;
      }

      await eternl.enable();
      setConnected(true);
      setWalletName("Eternl Connected");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition"
    >
      {walletName}
    </button>
  );
}
