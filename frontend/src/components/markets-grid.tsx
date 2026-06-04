"use client";

import { useMarkets } from "@/lib/hooks/use-markets";
import { MarketCard } from "./market-card";

export function MarketsGrid() {
  const { markets, isLoading, error, refetch } = useMarkets();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-64 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-red-900">Failed to load markets</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
        <p className="text-slate-600">No markets available yet</p>
        <p className="mt-2 text-sm text-slate-500">
          Check back later or create a new market
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  );
}
