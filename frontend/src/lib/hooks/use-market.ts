"use client";

import { useEffect, useState } from "react";
import { Market } from "@/lib/contract/types";
import { getMarket, getMarketPool } from "@/lib/contract/market-service";

interface UseMarketReturn {
  market: Market | null;
  pool: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMarket(marketId: number): UseMarketReturn {
  const [market, setMarket] = useState<Market | null>(null);
  const [pool, setPool] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarket = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const marketData = await getMarket(marketId);
      setMarket(marketData);

      const poolData = await getMarketPool(marketId);
      setPool(poolData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load market";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMarket();
  }, [marketId]);

  return {
    market,
    pool,
    isLoading,
    error,
    refetch: fetchMarket,
  };
}
