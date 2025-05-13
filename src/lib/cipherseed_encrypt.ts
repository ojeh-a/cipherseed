import CryptoJS from "crypto-js";

export function encryptSeed(
  seedWords: string[],
  customWords: { word: string; index: number }[],
  password: string
) {
  const modified = [...seedWords];
  customWords.forEach(({ word, index }) => {
    modified[index] = word;
  });
  const joined = modified.join(" ");
  const cipherText = CryptoJS.AES.encrypt(joined, password).toString();
  return cipherText;
}

export function saveWalletToLocal(
  walletName: string,
  cipherText: string,
  customWords: { word: string; index: number }[]
) {
  const existing = JSON.parse(
    localStorage.getItem("cipherseed_wallets") || "[]"
  );
  const newEntry = { walletName, cipherText, customWords };
  localStorage.setItem(
    "cipherseed_wallets",
    JSON.stringify([...existing, newEntry])
  );
}
