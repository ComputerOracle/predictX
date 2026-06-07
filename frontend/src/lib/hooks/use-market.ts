"use client";

import { useEffect, useState } from "react";
import { Market } from "@/lib/contract/types";
import { getMarket } from "@/lib/contract/market-service";
import { getMarketPool } from "@/lib/contract/betting-service";

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

  useEffect(() => {
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

    void fetchMarket();
  }, [marketId]);

  const refetch = async () => {
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

  return {
    market,
    pool,
    isLoading,
    error,
    refetch,
  };
}
