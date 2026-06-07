import { simulateContractCall } from "./soroban-client";
import { Market, MarketStatus } from "./types";

export async function listMarkets(): Promise<Market[]> {
  try {
    const result = await simulateContractCall("list_markets", []);

    if (!result) {
      return [];
    }

    if (!Array.isArray(result)) {
      console.warn("Expected array of markets, got:", result);
      return [];
    }

    return result.map((market: unknown) => parseMarketFromContract(market));
  } catch (error) {
    console.error("Error fetching markets:", error);
    throw error;
  }
}

export async function getMarket(marketId: number): Promise<Market> {
  try {
    const result = await simulateContractCall("get_market", [marketId]);

    if (!result) {
      throw new Error(`Market ${marketId} not found`);
    }

    return parseMarketFromContract(result);
  } catch (error) {
    console.error(`Error fetching market ${marketId}:`, error);
    throw error;
  }
}

interface ContractMarketData {
  id?: number | bigint;
  creator?: string;
  title?: string;
  description?: string;
  end_time?: number | bigint;
  outcomes?: string[];
  resolved?: boolean;
}

function parseMarketFromContract(data: unknown): Market {
  const marketData = data as ContractMarketData;
  return {
    id: typeof marketData.id === "bigint" ? Number(marketData.id) : marketData.id || 0,
    creator: marketData.creator || "",
    title: marketData.title || "",
    description: marketData.description || "",
    end_time:
      typeof marketData.end_time === "bigint" ? Number(marketData.end_time) : marketData.end_time || 0,
    outcomes: Array.isArray(marketData.outcomes) ? marketData.outcomes : [],
    resolved: Boolean(marketData.resolved),
  };
}

export function getMarketStatus(market: Market, currentTime: number): MarketStatus {
  if (market.resolved) {
    return MarketStatus.Resolved;
  }
  if (currentTime >= market.end_time) {
    return MarketStatus.Ended;
  }
  return MarketStatus.Active;
}

export function getTimeUntilResolution(endTime: number, currentTime: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const diff = endTime - currentTime;
  const isExpired = diff <= 0;

  const days = Math.floor(Math.abs(diff) / 86400);
  const hours = Math.floor((Math.abs(diff) % 86400) / 3600);
  const minutes = Math.floor((Math.abs(diff) % 3600) / 60);
  const seconds = Math.abs(diff) % 60;

  return { days, hours, minutes, seconds, isExpired };
}

export async function getMarketPool(marketId: number): Promise<number> {
  try {
    const result = await simulateContractCall("get_market_pool", [marketId]);

    if (typeof result === "number") {
      return result;
    }

    if (typeof result === "bigint") {
      return Number(result);
    }

    return 0;
  } catch (error) {
    console.error("Error fetching market pool:", error);
    return 0;
  }
}
