// app/about/page.tsx

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">About Cipherseed</h1>
        <p>
          Cipherseed is a decentralized app built on the Cardano blockchain. It
          helps users customize and locally encrypt their crypto recovery
          phrases using secret words known only to them.
        </p>
        <p>
          This approach ensures users retain control over their wallets while
          minimizing the risk of loss from forgotten seed phrases. All
          encryption happens on the user's device — we don’t store any data.
        </p>
        <p>
          Built using <strong>Next.js, Lucid, Aiken</strong>, and{" "}
          <strong>AES-256 encryption</strong>, Cipherseed is made for Africans
          and anyone seeking secure self-custody.
        </p>
        <p>
          Learn more or contribute on{" "}
          <a
            href="https://github.com/your-repo-link"
            className="text-blue-400 underline"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </main>
  );
}
