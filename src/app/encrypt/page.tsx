// app/encrypt/page.tsx

"use client";

import CryptoJS from "crypto-js";
import { useState } from "react";
import { Lock } from "lucide-react";

export default function EncryptPage() {
  const [walletName, setWalletName] = useState("");
  const [seedLength, setSeedLength] = useState(12);
  const [phraseWords, setPhraseWords] = useState(Array(12).fill(""));
  const [customWords, setCustomWords] = useState(["", "", ""]);
  const [positions, setPositions] = useState(["", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [output, setOutput] = useState("");

  const handleEncrypt = () => {
    if (
      !walletName ||
      !password ||
      customWords.includes("") ||
      positions.includes("")
    ) {
      setOutput("❌ Fill all fields");
      return;
    } else if (!confirmPassword) {
      setOutput("❌ Confirm Password");
    }

   const fullPhrase = [...phraseWords];
   const posNums = positions.map((p) => parseInt(p) - 1)

   const encrypted = CryptoJS.AES.encrypt(fullPhrase.join(" "), password).toString();

   const walletData = {
    walletName,
    encrypted,
    customWords,
    positions: posNums,
   };

    let wallets = [];
    try {
      const stored = localStorage.getItem("wallets");
      wallets = JSON.parse(stored || "[]");
      if (!Array.isArray(wallets)) throw new Error();
    } catch {
      wallets = [];
    }

    if (wallets.some(w => w.walletName === walletName)) {
      setOutput("❌ Wallet name already exists. Choose a different name.");
      return
    }
    wallets.push(walletData);
    localStorage.setItem("wallets", JSON.stringify(wallets));

    setOutput(`✅ Wallet "${walletName}" encrypted and saved.`);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6 bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold flex items-center gap-2 justify-center">
          <Lock className="text-blue-500" /> Secure Backup
        </h1>

        <input
          placeholder="Wallet Name"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
        />

        <select
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          value={seedLength}
          onChange={(e) => {
            const newLength = parseInt(e.target.value);
            setSeedLength(newLength);
            setPhraseWords(Array(newLength).fill(""));
          }}
        >
          <option value={12}>12-word phrase</option>
          <option value={15}>15-word phrase</option>
          <option value={24}>24-word phrase</option>
        </select>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {phraseWords.map((word, i) => (
            <input
              key={i}
              type="text"
              value={word}
              onChange={(e) => {
                const updated = [...phraseWords];
                updated[i] = e.target.value;
                setPhraseWords(updated);
              }}
              placeholder={`Word ${i + 1}`}
              className="p-2 bg-gray-800 border border-gray-700 rounded-md"
            />
          ))}
        </div>

        <div>
          {/* <input
            type="text"
            onChange={(e) =>
            setPositions(e.target.value.split(",").map((s) => s.trim()))
            }
            className="border p-2"
            /> */}
        </div>

            <h1 className="text-center">Replace at positions (e.g., 3, 7, 12):</h1>
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
              <select
                value={positions[i]}
                onChange={(e) => {
                  const updated = [...positions];
                  updated[i] = e.target.value;
                  setPositions(updated);
                }}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
              >
                <option value="">Position</option>
                {phraseWords.map((_, idx) => (
                  <option key={idx} value={idx + 1}>
                    Word {idx + 1}
                  </option>
                ))}
              </select>
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

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={() => {
            if (password !== confirmPassword) {
              setOutput("❌ Passwords don't match");
            } else handleEncrypt();
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-lg font-semibold"
        >
          Encrypt & Save
        </button>

        {output && <p className="text-green-400 text-sm mt-4">{output}</p>}
      </div>
    </main>
  );
}
