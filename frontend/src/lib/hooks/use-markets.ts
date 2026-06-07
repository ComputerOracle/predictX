"use client";

import { useEffect, useState } from "react";
import { Market } from "@/lib/contract/types";
import { listMarkets } from "@/lib/contract/market-service";

export function useMarkets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    void fetchMarkets();
  }, []);

  const refetch = async () => {
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

  return { markets, isLoading, error, refetch };
}
