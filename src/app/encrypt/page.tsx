"use client";

import CryptoJS from "crypto-js";
import { useState } from "react";
import { Lock } from "lucide-react";

type BackupType =
  | "wallet-seed"
  | "wallet-address"
  | "password-manager"
  | "private-document"
  | "private-file";

export default function EncryptPage() {
  const [backupType, setBackupType] = useState<BackupType>("wallet-seed");
  const [walletName, setWalletName] = useState("");
  const [seedLength, setSeedLength] = useState(12);
  const [phraseWords, setPhraseWords] = useState(Array(12).fill(""));
  const [walletAddress, setWalletAddress] = useState("");
  const [passwordEntries, setPasswordEntries] = useState([
    { site: "", username: "", password: "" },
  ]);
  const [documentName, setDocumentName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [customWords, setCustomWords] = useState(["", "", ""]);
  const [positions, setPositions] = useState(["", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [output, setOutput] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<string | null>(null);

  // Reset fields when backup type changes
  const handleBackupTypeChange = (type: BackupType) => {
    setBackupType(type);
    setOutput("");
    setWalletName("");
    setPhraseWords(Array(12).fill(""));
    setWalletAddress("");
    setPasswordEntries([{ site: "", username: "", password: "" }]);
    setDocumentName("");
    setDocumentContent("");
    setCustomWords(["", "", ""]);
    setPositions(["", "", ""]);
    setPassword("");
    setConfirmPassword("");
    setFileName("");
    setFileData(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEncrypt = () => {
    if (!password || !confirmPassword) {
      setOutput("❌ Fill all password fields");
      return;
    }
    if (password !== confirmPassword) {
      setOutput("❌ Passwords don't match");
      return;
    }

    let dataToEncrypt: any = {};
    let backupLabel = "";

    if (backupType === "wallet-seed") {
      if (
        !walletName ||
        phraseWords.includes("") ||
        customWords.includes("") ||
        positions.includes("")
      ) {
        setOutput("❌ Fill all wallet fields");
        return;
      }
      dataToEncrypt = {
        type: "wallet-seed",
        walletName,
        phrase: phraseWords,
        customWords,
        positions: positions.map((p) => parseInt(p) - 1),
      };
      backupLabel = walletName;
    } else if (backupType === "wallet-address") {
      if (!walletName || !walletAddress) {
        setOutput("❌ Fill all wallet address fields");
        return;
      }
      dataToEncrypt = {
        type: "wallet-address",
        walletName,
        walletAddress,
      };
      backupLabel = walletName;
    } else if (backupType === "password-manager") {
      if (
        !walletName ||
        passwordEntries.some((e) => !e.site || !e.username || !e.password)
      ) {
        setOutput("❌ Fill all password manager fields");
        return;
      }
      dataToEncrypt = {
        type: "password-manager",
        walletName,
        entries: passwordEntries,
      };
      backupLabel = walletName;
    } else if (backupType === "private-document") {
      if (!documentName || !documentContent) {
        setOutput("❌ Fill all document fields");
        return;
      }
      dataToEncrypt = {
        type: "private-document",
        documentName,
        documentContent,
      };
      backupLabel = documentName;
    } else if (backupType === "private-file") {
      if (!fileName || !fileData) {
        setOutput("❌ Please select a file to encrypt.");
        return;
      }
      dataToEncrypt = {
        type: "private-file",
        fileName,
        fileData, // base64 string
      };
      backupLabel = fileName;
    }

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      password
    ).toString();
    const pob = CryptoJS.SHA256(encrypted).toString();

    // Save to localStorage (optional, only for wallet-seed and wallet-address)
    if (backupType === "wallet-seed" || backupType === "wallet-address") {
      let backups = [];
      try {
        const stored = localStorage.getItem("backups");
        backups = JSON.parse(stored || "[]");
        if (!Array.isArray(backups)) throw new Error();
      } catch {
        backups = [];
      }
      // Prevent duplicate names
      if (
        backups.some(
          (b) => b.backupLabel === backupLabel && b.type === backupType
        )
      ) {
        setOutput("❌ Backup name already exists. Choose a different name.");
        return;
      }
      backups.push({ backupLabel, type: backupType, encrypted, pob });
      localStorage.setItem("backups", JSON.stringify(backups));
    }

    setOutput(`✅ Backup "${backupLabel}" encrypted and ready to download.`);

    
    // Store for download
    (window as any)._encryptedBackup = {
      backupLabel,
      type: backupType,
      encrypted,
      pob,
    };
  };

  const handleDownload = () => {
    const backup = (window as any)._encryptedBackup;
    if (!backup) return;
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${backup.backupLabel || "backup"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6 bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold flex items-center gap-2 justify-center">
          <Lock className="text-blue-500" /> Secure Backup
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

        {/* Wallet Seed Phrase */}
        {backupType === "wallet-seed" && (
          <>
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
            <h1 className="text-center">
              Replace at positions (e.g., 3, 7, 12):
            </h1>
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
          </>
        )}

        {/* Wallet Address */}
        {backupType === "wallet-address" && (
          <>
            <input
              placeholder="Wallet Name"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
            <input
              placeholder="Wallet Address"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </>
        )}

        {/* Password Manager */}
        {backupType === "password-manager" && (
          <>
            <input
              placeholder="Backup Name"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
            <div className="space-y-2">
              {passwordEntries.map((entry, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    placeholder="Site"
                    className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-md"
                    value={entry.site}
                    onChange={(e) => {
                      const updated = [...passwordEntries];
                      updated[idx].site = e.target.value;
                      setPasswordEntries(updated);
                    }}
                  />
                  <input
                    placeholder="Username"
                    className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-md"
                    value={entry.username}
                    onChange={(e) => {
                      const updated = [...passwordEntries];
                      updated[idx].username = e.target.value;
                      setPasswordEntries(updated);
                    }}
                  />
                  <input
                    placeholder="Password"
                    type="password"
                    className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-md"
                    value={entry.password}
                    onChange={(e) => {
                      const updated = [...passwordEntries];
                      updated[idx].password = e.target.value;
                      setPasswordEntries(updated);
                    }}
                  />
                  <button
                    type="button"
                    className="bg-red-600 px-2 rounded text-white"
                    onClick={() => {
                      setPasswordEntries((entries) =>
                        entries.length > 1
                          ? entries.filter((_, i) => i !== idx)
                          : entries
                      );
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-green-600 px-4 py-1 rounded text-white mt-2"
                onClick={() =>
                  setPasswordEntries((entries) => [
                    ...entries,
                    { site: "", username: "", password: "" },
                  ])
                }
              >
                + Add Entry
              </button>
            </div>
          </>
        )}

        {/* Private Document */}
        {backupType === "private-document" && (
          <>
            <input
              placeholder="Document Name"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
            <textarea
              placeholder="Paste or type your private document here..."
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 min-h-[120px]"
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
            />
          </>
        )}

        {/* Private File */}
        {backupType === "private-file" && (
          <>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              onChange={handleFileChange}
            />
            {fileName && (
              <div className="text-sm text-gray-400 mt-2">
                Selected: {fileName}
              </div>
            )}
          </>
        )}

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
          onClick={handleEncrypt}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-lg font-semibold"
        >
          Encrypt & Save
        </button>

        {output && (
          <>
            <p className="text-green-400 text-sm mt-4">{output}</p>
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-lg font-semibold mt-2"
            >
              Download Encrypted Data
            </button>
          </>
        )}
      </div>
    </main>
  );
}
