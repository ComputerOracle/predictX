import { WalletPanel } from "@/components/wallet-panel";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-stellar">
              Stellar Soroban Scaffold
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold text-ink">
              PredictX
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Open-source prediction marketplace foundation with contract,
              wallet, deployment, and documentation placeholders ready for MVP
              implementation.
            </p>
          </div>

          <WalletPanel />
        </section>
      </main>
    </>
  );
}

