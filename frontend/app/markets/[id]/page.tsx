"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useMarket } from "@/lib/hooks/use-market";
import { MarketDetails } from "@/components/market-details";

export default function MarketPage() {
  const params = useParams();
  const marketId = parseInt(params.id as string);

  const { market, pool, isLoading, error, refetch } = useMarket(marketId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto w-full max-w-4xl px-6 py-10">
          <div className="mb-8">
            <Link
              href="/markets"
              className="text-sm font-medium text-ink hover:underline"
            >
              ← Back to Markets
            </Link>
          </div>

          <div className="space-y-6">
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-32 w-full animate-pulse rounded-lg bg-slate-200" />
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-24 animate-pulse rounded-lg bg-slate-200"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !market) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto w-full max-w-4xl px-6 py-10">
          <div className="mb-8">
            <Link
              href="/markets"
              className="text-sm font-medium text-ink hover:underline"
            >
              ← Back to Markets
            </Link>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-900">Market Not Found</h2>
            <p className="mt-2 text-sm text-red-700">
              {error || "Could not load market details"}
            </p>
            <Link
              href="/markets"
              className="mt-4 inline-block rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Return to Markets
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/markets"
            className="text-sm font-medium text-ink hover:underline"
          >
            ← Back to Markets
          </Link>
        </div>

        <MarketDetails market={market} pool={pool} onRefetch={refetch} />
      </section>
    </main>
  );
}
