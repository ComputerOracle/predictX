"use client";

import { useEffect, useState } from "react";
import { Market } from "@/lib/contract/types";
import { listMarkets } from "@/lib/contract/market-service";

export function useMarkets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listMarkets();
      setMarkets(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load markets";
      setError(message);
      console.error("Error loading markets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMarkets();
  }, []);

  const refetch = () => void fetchMarkets();

  return { markets, isLoading, error, refetch };
}
