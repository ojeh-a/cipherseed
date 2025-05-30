"use client";
import { initLucid } from "@/lib/lucid";
import { Data, Constr, getAddressDetails } from "@lucid-evolution/lucid";

export default function StakingPage() {
  const stake = async () => {
    try {
      // 1. Initialize Lucid
      const lucid = await initLucid();
      const wallet = await lucid.wallet();

      // 2. Get wallet details
      const address = await wallet.address();
      const utxos = await wallet.getUtxos();
      if (utxos.length === 0) throw new Error("Fund your wallet first");

      // 3. Prepare contract data
      const stakeAmount = BigInt(5_000_000);
      const paymentCredential = getAddressDetails(address).paymentCredential;
      if (!paymentCredential) throw new Error("No payment credential found");

      const datum = Data.to(
        new Constr(0, [
          Data.from(paymentCredential.hash),
          Data.from(stakeAmount.toString()),
        ])
      );

      // 4. Get contract address
      const contractAddress = (await import("@/../public/plutus.json"))
        .validatorAddress;

      // 5. Build and submit tx
      const tx = await lucid
        .newTx()
        .collectFrom(utxos)
        .pay.ToContract(contractAddress, datum, { lovelace: stakeAmount })
        .complete();

      const txHash = await tx.sign().withWallet().submit();
      console.log("Success:", txHash);
      alert("Staked successfully!");
    } catch (error) {
      console.error("Staking failed:", error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <button
      onClick={stake}
      className="bg-purple-600 text-white px-4 py-2 rounded"
    >
      Stake 5 ADA
    </button>
  );
}
