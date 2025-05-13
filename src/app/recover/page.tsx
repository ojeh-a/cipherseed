// app/recover/page.tsx

"use client";

import CryptoJS from "crypto-js";
import { useState, useEffect } from "react";
import { Unlock } from "lucide-react";

export default function RecoverPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [customWords, setCustomWords] = useState(["", "", ""]);
  const [positions, setPositions] = useState(["", "", ""]);
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wallets");
      const parsed = JSON.parse(stored || "[]");
      if (Array.isArray(parsed)) setWallets(parsed);
    } catch {
      setWallets([]);
    }
  }, []);

  const handleRecover = () => {
    const entry = wallets.find((w) => w.walletName === selectedWallet);
    if (!entry) return setOutput("❌ Wallet not found.");

    try {
      const posNums = positions.map((p) => parseInt(p) - 1);
      for (let i = 0; i < 3; i++) {
        if (
          parseInt(positions[i]) !== entry.positions[i] + 1 ||
          customWords[i] !== entry.customWords[i]
        ) {
          throw new Error("invalid custom word or position");
        }
      }

      const decrypted = CryptoJS.AES.decrypt(
        entry.encrypted,
        password
      ).toString(CryptoJS.enc.Utf8);
      if (!decrypted) throw new Error("Invalid password or corrupted data");
      setOutput(`✅ Recovered Phrase:\n${decrypted}`);
    } catch {
      setOutput("❌ Failed to recover. Check inputs.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 p-8 rounded-xl space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Unlock className="text-green-500" /> Recover Wallet
        </h1>

        <select
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          value={selectedWallet}
          onChange={(e) => setSelectedWallet(e.target.value)}
        >
          <option value="">Select Wallet</option>
          {wallets.map((w, i) => (
            <option key={`${w.walletName}-${i}`} value={w.walletName}>
              {w.walletName}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {customWords.map((word, i) => (
            <div key={i} className="space-y-2">
              <input
                type="text"
                value={word}
                onChange={(e) => {
                  const updated = [...customWords];
                  updated[i] = e.target.value;
                  setCustomWords(updated);
                }}
                placeholder={`Secret Word ${i + 1}`}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
              />
              <input
                type="number"
                placeholder="Position"
                value={positions[i]}
                onChange={(e) => {
                  const updated = [...positions];
                  updated[i] = e.target.value;
                  setPositions(updated);
                }}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
              />
            </div>
          ))}
        </div>

        <input
          type="password"
          placeholder="Encryption Password"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRecover}
          className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-lg font-semibold"
        >
          Recover Phrase
        </button>

        {output && (
          <div className="mt-6 bg-gray-800 border border-green-500 rounded-xl p-6 text-green-300 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">🔓 Recovered Phrase:</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm font-mono whitespace-pre-wrap break-words">
              {output
                .replace(/^✅ Recovered Phrase:\n/, "")
                .split(" ")
                .map((word, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-center"
                  >
                    <span className="text-xs text-gray-400">{i + 1}.</span>{" "}
                    {word}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
