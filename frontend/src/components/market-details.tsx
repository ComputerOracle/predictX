"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Market, MarketStatus } from "@/lib/contract/types";
import {
  getMarketStatus,
  getTimeUntilResolution,
} from "@/lib/contract/market-service";
import { PlaceBetForm } from "./place-bet-form";

interface MarketDetailsProps {
  market: Market;
  pool: number;
  onRefetch: () => void;
}

export function MarketDetails({
  market,
  pool,
  onRefetch,
}: MarketDetailsProps) {
  const [status, setStatus] = useState<MarketStatus | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const updateStatus = () => {
      const now = Math.floor(Date.now() / 1000);
      const marketStatus = getMarketStatus(market, now);
      setStatus(marketStatus);

      const timeData = getTimeUntilResolution(market.end_time, now);
      if (timeData.isExpired) {
        setTimeRemaining("Resolution ended");
      } else {
        const parts = [];
        if (timeData.days > 0) parts.push(`${timeData.days}d`);
        if (timeData.hours > 0) parts.push(`${timeData.hours}h`);
        if (timeData.minutes > 0) parts.push(`${timeData.minutes}m`);
        setTimeRemaining(parts.join(" ") || "< 1 minute");
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, [market]);

  const getStatusColor = (s: MarketStatus | null) => {
    switch (s) {
      case MarketStatus.Active:
        return "bg-green-50 text-green-700 border-green-200";
      case MarketStatus.Ended:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case MarketStatus.Resolved:
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusDot = (s: MarketStatus | null) => {
    switch (s) {
      case MarketStatus.Active:
        return "bg-green-500";
      case MarketStatus.Ended:
        return "bg-yellow-500";
      case MarketStatus.Resolved:
        return "bg-blue-500";
      default:
        return "bg-slate-500";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatPool = (amount: number) => {
    return (amount / 10000000).toFixed(7);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-ink">{market.title}</h1>
            <p className="mt-2 text-slate-600">{market.description}</p>
          </div>
          {status && (
            <div
              className={clsx(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium whitespace-nowrap",
                getStatusColor(status)
              )}
            >
              <div
                className={clsx(
                  "h-2 w-2 rounded-full",
                  getStatusDot(status)
                )}
              />
              {status}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-600">
            Total Pool
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-ink">
            {formatPool(pool)} XLM
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-600">
            Time Remaining
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-ink">
            {timeRemaining}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-600">
            End Time
          </p>
          <p className="mt-2 text-sm text-ink break-words">
            {formatDate(market.end_time)}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-600">
            Outcomes
          </p>
          <p className="mt-2 text-lg font-semibold text-ink">
            {market.outcomes.length}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-ink">Outcomes</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {market.outcomes.map((outcome, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <p className="text-sm font-medium text-slate-600">
                Outcome {idx + 1}
              </p>
              <p className="mt-1 text-lg font-semibold text-ink">{outcome}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h2 className="mb-4 text-xl font-semibold text-ink">Place Your Bet</h2>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <PlaceBetForm market={market} onBetSuccess={onRefetch} />
        </div>
      </div>
    </div>
  );
}
