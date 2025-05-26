import React, { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import CryptoJS from "crypto-js";

export default function LighthouseStorage() {
  const [dataToEncrypt, setDataToEncrypt] = useState<string>("");
  const [encryptedData, setEncryptedData] = useState<string>("");
  const [ipfsHash, setIpfsHash] = useState<string>("");
  const [retrievedData, setRetrievedData] = useState<any>(null);

  const apiKey = process.env.LIGHTHOUSE_API_KEY!;

  const handleEncrypt = () => {
    const dummyEncrypted = JSON.stringify({ data: dataToEncrypt });
    setEncryptedData(dummyEncrypted);
  };

  const uploadToLighthouse = async () => {
    try {
      const file = new File([encryptedData], "cipherseed-encrypted.json", {
        type: "application/json",
      });

      const response = await lighthouse.upload(file, apiKey);
      setIpfsHash(response.data.Hash);
      alert("Upload successful! IPFS Hash: " + response.data.Hash);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed, check console.");
    }
  };

  const fetchFromLighthouse = async () => {
    try {
      if (!ipfsHash) return alert("No IPFS hash to fetch");
      const url = `https://ipfs.io/ipfs/${ipfsHash}`;
      const res = await fetch(url);
      const data = await res.json();
      setRetrievedData(data);
    } catch (error) {
      console.error("Fetch failed:", error);
      alert("Fetch failed, check console.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Lighthouse Storage Demo</h2>

      <textarea
        rows={4}
        className="w-full p-2 border rounded mb-2"
        placeholder="Enter data to encrypt"
        value={dataToEncrypt}
        onChange={(e) => setDataToEncrypt(e.target.value)}
      />

      <button
        onClick={handleEncrypt}
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
      >
        Encrypt Data (dummy)
      </button>

      <button
        onClick={uploadToLighthouse}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Upload to Lighthouse
      </button>

      {ipfsHash && (
        <div className="mt-4">
          <p className="font-semibold">IPFS Hash:</p>
          <p className="break-all">{ipfsHash}</p>
          <button
            onClick={fetchFromLighthouse}
            className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
          >
            Fetch from Lighthouse
          </button>
        </div>
      )}

      {retrievedData && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <h3 className="font-semibold mb-2">Retrieved Data:</h3>
          <pre>{JSON.stringify(retrievedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
