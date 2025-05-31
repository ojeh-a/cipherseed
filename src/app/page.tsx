'use client';
import Link from "next/link";
import { Lock, Unlock, Info, Github } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome to Cipherseed
        </h1>
        <p className="text-gray-400 text-lg">
          Secure and personalize your crypto recovery experience — all on your
          device.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="./encrypt"
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-3 rounded-xl transition"
          >
            <Lock /> Encrypt Phrase
          </Link>

          <Link
            href="./recover"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-3 rounded-xl transition"
          >
            <Unlock /> Recover Phrase
          </Link>

          <Link
            href="./staking"
            className="flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl transition col-span-full"
          >
             Stake ADA
          </Link>

          <Link
            href="./about"
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-3 rounded-xl transition col-span-full"
          >
            <Info /> About
          </Link>

          <a
            href="https://github.com/ojeh-a/cipherseed"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-3 rounded-xl transition col-span-full"
          >
            <Github /> Contribute on GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
