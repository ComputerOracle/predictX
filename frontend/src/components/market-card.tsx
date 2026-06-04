"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Market, MarketStatus } from "@/lib/contract/types";
import {
  getMarketStatus,
  getTimeUntilResolution,
} from "@/lib/contract/market-service";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
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
    const interval = setInterval(updateStatus, 60000); // Update every minute
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

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ink line-clamp-2">
            {market.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">
            {market.description}
          </p>
        </div>
        {status && (
          <div
            className={clsx(
              "ml-4 flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap",
              getStatusColor(status)
            )}
          >
            <div className={clsx("h-2 w-2 rounded-full", getStatusDot(status))} />
            {status}
          </div>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <div className="text-sm text-slate-600">
          <span className="font-medium text-ink">Outcomes:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {market.outcomes.map((outcome, idx) => (
              <span
                key={idx}
                className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
              >
                {outcome}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <div>
          <p className="text-xs text-slate-500">Time to resolution</p>
          <p className="mt-1 font-mono text-sm font-medium text-ink">
            {timeRemaining}
          </p>
        </div>
        <Link
          href={`/markets/${market.id}`}
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
