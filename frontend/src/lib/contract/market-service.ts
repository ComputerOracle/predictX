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

    return result.map((market: any) => parseMarketFromContract(market));
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

function parseMarketFromContract(data: any): Market {
  return {
    id: typeof data.id === "bigint" ? Number(data.id) : data.id,
    creator: data.creator || "",
    title: data.title || "",
    description: data.description || "",
    end_time:
      typeof data.end_time === "bigint" ? Number(data.end_time) : data.end_time,
    outcomes: Array.isArray(data.outcomes) ? data.outcomes : [],
    resolved: Boolean(data.resolved),
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
