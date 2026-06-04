import { MarketsGrid } from "@/components/markets-grid";

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-ink">Markets</h1>
          <p className="text-slate-600">
            Explore available prediction markets and place your bets
          </p>
        </div>

        <MarketsGrid />
      </section>
    </main>
  );
}
