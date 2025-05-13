'use client'

import { useState } from "react"
import EncryptButton from "./EncryptButton"
import DecryptButton from "./DecryptButton"

export default function CipherTool() {
    const [originalPhrase, setOriginalPhrase] = useState("");
    const [customWords, setCustomWords] = useState(["", "", ""]);
    const [password, setPassword] = useState("");
    const [encrypted, setEncrypted] = useState("");
    const [decrypted, setDecrypted] = useState("");

    const handleEncrypt = async () => {
        const modified = originalPhrase
        .split(" ")
        .map((word, i) => (i < 3 ? customWords[i] || word : word))
        .join(" ");
        const encoded = btoa(modified + "|" + password);
        setEncrypted(encoded);
    };

    const handleDecrypt = async () => {
        try {
            const decoded = atob(encrypted);
            const [phrase, key] = decoded.split("|");
            if (key === password) {
                setDecrypted(phrase);
            } else {
                setDecrypted("❌ Invalid password")
            }
        } catch (err) {
            setDecrypted("⚠️ Decryption Failed");
        }
    };

    return (
        <div className="space-y-4 p-4 max-w-xl mx-auto">
            <textarea
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Enter your 12 or 24-word recovery phrase"
                value={originalPhrase}
                onChange={(e) => setOriginalPhrase(e.target.value)}
            />
            <div className="flex gap-2">
                {customWords.map((word, i) => (
                    <input
                        key={i}
                        className="flex-1 p-2 border rounded"
                        placeholder={`Secret ${i + 1}`}
                        value={word}
                        onChange={(e) => {
                            const newWords = [...customWords];
                            newWords[i] = e.target.value;
                            setCustomWords(newWords);
                        }}
                    />
                ))}
            </div>

            <input
                type="password"
                className="w-full p-2 border rounded"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex gap-4">
                <EncryptButton onEncrypt={handleEncrypt} disabled={!originalPhrase || !password} />
                <DecryptButton onDecrypt={handleDecrypt} disabled={!encrypted ||  !password} />
            </div>

            {encrypted && (
                <div className="bg-gray-100 p-2 rounded">
                    <strong>Encrypted</strong> <code>{encrypted}</code>
                </div>
            )}

            {decrypted && (
                <div className="bg-green-100 p-2 rounded">
                    <strong>Decrypted</strong><code>{decrypted}</code>
                </div>
            )}
        </div>
    )
}