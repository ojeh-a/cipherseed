"use client";

import { useState } from "react";

export default function ConnectEternlButton() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");

  const handleConnect = async () => {
    try {
      const { initLucid, getLucid } = await import("@/lib/lucid");
      await initLucid();

      const lucid = getLucid();
      const userAddress = await lucid.wallet().address();
      setAddress(userAddress);
      setConnected(true);

    } catch (err) {
      console.error("Connection failed:", err);
      alert("Failed to connect to Eternl wallet.");
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleConnect}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {connected ? "Wallet Connected" : "Connect Eternl wallet"}
      </button>

      {address && (
        <div className="bg-gray-800 text-green-400 p-3 rounded break-all">
            <strong>Address:</strong>{address}
        </div>
      )}
    </div>
  );
}
