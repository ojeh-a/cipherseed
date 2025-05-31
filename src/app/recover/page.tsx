"use client";

import CryptoJS from "crypto-js";
import { useState, useEffect } from "react";
import { Unlock } from "lucide-react";

type BackupType =
  | "wallet-seed"
  | "wallet-address"
  | "password-manager"
  | "private-document"
  | "private-file";

export default function RecoverPage() {
  const [backupType, setBackupType] = useState<BackupType>("wallet-seed");
  const [backups, setBackups] = useState<any[]>([]);
  const [selectedBackup, setSelectedBackup] = useState<any | null>(null);
  const [customWords, setCustomWords] = useState(["", "", ""]);
  const [positions, setPositions] = useState(["", "", ""]);
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState("");

  // Load backups from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("backups");
      const parsed = JSON.parse(stored || "[]");
      if (Array.isArray(parsed)) setBackups(parsed);
    } catch {
      setBackups([]);
    }
  }, []);

  // Import backup file
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      let newBackups = [];
      if (Array.isArray(imported)) {
        newBackups = imported;
      } else if (imported.encrypted && imported.type) {
        newBackups = [imported];
      } else {
        setError("❌ Invalid backup file.");
        return;
      }
      setBackups((prev) => {
        const merged = [...prev];
        newBackups.forEach((b) => {
          if (
            !merged.some(
              (mb) => mb.backupLabel === b.backupLabel && mb.type === b.type
            )
          ) {
            merged.push(b);
          }
        });
        localStorage.setItem("backups", JSON.stringify(merged));
        return merged;
      });
      setError("");
    } catch {
      setError("❌ Failed to import backup file.");
    }
  };

  // Handle backup type change
  const handleBackupTypeChange = (type: BackupType) => {
    setBackupType(type);
    setSelectedBackup(null);
    setOutput(null);
    setError("");
    setCustomWords(["", "", ""]);
    setPositions(["", "", ""]);
    setPassword("");
  };

  // Handle backup selection
  const handleSelect = (label: string) => {
    const found = backups.find(
      (b) => b.backupLabel === label && b.type === backupType
    );
    setSelectedBackup(found || null);
    setOutput(null);
    setError("");
    setCustomWords(["", "", ""]);
    setPositions(["", "", ""]);
    setPassword("");
  };

  // Handle recovery
  const handleRecover = () => {
    if (!selectedBackup) return setError("❌ No backup selected.");
    setError("");
    setOutput(null);

    try {
      const decrypted = CryptoJS.AES.decrypt(
        selectedBackup.encrypted,
        password
      ).toString(CryptoJS.enc.Utf8);

      if (!decrypted) throw new Error("Invalid password or corrupted data");

      const data = JSON.parse(decrypted);

      if (backupType === "wallet-seed") {
        for (let i = 0; i < 3; i++) {
          if (
            parseInt(positions[i]) !== data.positions[i] + 1 ||
            customWords[i] !== data.customWords[i]
          ) {
            throw new Error("invalid custom word or position");
          }
        }
        setOutput({ type: "wallet-seed", phrase: data.phrase });
      } else if (backupType === "wallet-address") {
        setOutput({
          type: "wallet-address",
          walletAddress: data.walletAddress,
        });
      } else if (backupType === "password-manager") {
        setOutput({ type: "password-manager", entries: data.entries });
      } else if (backupType === "private-document") {
        setOutput({
          type: "private-document",
          documentName: data.documentName,
          documentContent: data.documentContent,
        });
      } else if (backupType === "private-file") {
        setOutput({
          type: "private-file",
          fileName: data.fileName,
          fileData: data.fileData,
        });
      }
    } catch (e: any) {
      setError("❌ Failed to recover. Check inputs and password.");
    }
  };

  // Download decrypted file for private-file
  const handleDownloadFile = () => {
    if (!output || output.type !== "private-file") return;
    const link = document.createElement("a");
    link.href = output.fileData;
    link.download = output.fileName;
    link.click();
  };

  // Label for select dropdown
  const selectLabel = {
    "wallet-seed": "Select Wallet",
    "wallet-address": "Select Wallet Address",
    "password-manager": "Select Password Manager Backup",
    "private-document": "Select Document",
    "private-file": "Select File",
  }[backupType];

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 p-8 rounded-xl space-y-6">
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-center">
            Import Backup File
          </label>
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
          />
        </div>

        <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
          <Unlock className="text-green-500" /> Recover Backup
        </h1>

        <select
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          value={backupType}
          onChange={(e) => handleBackupTypeChange(e.target.value as BackupType)}
        >
          <option value="wallet-seed">Wallet Seed Phrase</option>
          <option value="wallet-address">Wallet Address</option>
          <option value="password-manager">Password Manager</option>
          <option value="private-document">Private Text Document</option>
          <option value="private-file">Private File (PDF, etc.)</option>
        </select>

        <label className="block mb-2 font-semibold">{selectLabel}</label>
        <select
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          value={selectedBackup?.backupLabel || ""}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">-- {selectLabel} --</option>
          {backups
            .filter((b) => b.type === backupType)
            .map((b, i) => (
              <option key={`${b.backupLabel}-${i}`} value={b.backupLabel}>
                {b.backupLabel}
              </option>
            ))}
        </select>

        {backupType === "wallet-seed" && selectedBackup && (
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
        )}

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
          Recover
        </button>

        {error && (
          <div className="mt-4 bg-gray-800 border border-red-500 rounded-xl p-4 text-red-300 shadow-lg">
            {error}
          </div>
        )}

        {output && output.type === "wallet-seed" && (
          <div className="mt-6 bg-gray-800 border border-green-500 rounded-xl p-6 text-green-300 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">🔓 Recovered Phrase:</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm font-mono whitespace-pre-wrap break-words">
              {output.phrase.map((word: string, i: number) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-center"
                >
                  <span className="text-xs text-gray-400">{i + 1}.</span> {word}
                </div>
              ))}
            </div>
          </div>
        )}

        {output && output.type === "wallet-address" && (
          <div className="mt-6 bg-gray-800 border border-blue-500 rounded-xl p-6 text-blue-300 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">🔓 Wallet Address:</h2>
            <div className="font-mono break-all">{output.walletAddress}</div>
          </div>
        )}

        {output && output.type === "password-manager" && (
          <div className="mt-6 bg-gray-800 border border-yellow-500 rounded-xl p-6 text-yellow-300 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">🔓 Password Entries:</h2>
            <div className="space-y-2">
              {output.entries.map((entry: any, i: number) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-700 rounded p-2"
                >
                  <div>
                    <span className="font-semibold">Site:</span> {entry.site}
                  </div>
                  <div>
                    <span className="font-semibold">Username:</span>{" "}
                    {entry.username}
                  </div>
                  <div>
                    <span className="font-semibold">Password:</span>{" "}
                    {entry.password}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {output && output.type === "private-document" && (
          <div className="mt-6 bg-gray-800 border border-purple-500 rounded-xl p-6 text-purple-300 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              🔓 {output.documentName}
            </h2>
            <div className="whitespace-pre-wrap">{output.documentContent}</div>
          </div>
        )}

        {output && output.type === "private-file" && (
          <div className="mt-6 bg-gray-800 border border-pink-500 rounded-xl p-6 text-pink-300 shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-2">🔓 {output.fileName}</h2>
            <button
              onClick={handleDownloadFile}
              className="bg-pink-600 hover:bg-pink-700 transition py-2 px-4 rounded-lg font-semibold mt-2"
            >
              Download File
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
