import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

// Initialize Lucid with async/await
const initializeLucid = async () => {
  const blockfrostApiKey = "preprodT70f78P4qEWkten5BcASVloJs2XlmXqm";
  return await Lucid.init(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      blockfrostApiKey
    ),
    "Preprod"
  );
};

export const claimRewards = async (userAddress: string) => {
  try {
    const lucid = await initializeLucid();

    // 1. Convert contract address to Validator object
    const validator = {
      type: "PlutusV2" as const,
      script: "YOUR_COMPILED_PLUTUS_SCRIPT_HEX", // From 'aiken blueprint convert'
    };

    // 2. Use BigInt explicitly (TS-safe)
    const userReward = BigInt(900000);
    const devFee = BigInt(20000);

    // 3. Correct transaction building
    const tx = await lucid
      .newTx()
      .readFrom([validator]) // Requires Validator[]
      .payToAddress(userAddress, { lovelace: userReward })
      .payToAddress("addr_test1qp0...YOUR_DEV_WALLET", { lovelace: devFee })
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new Error(
      `Claim failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
