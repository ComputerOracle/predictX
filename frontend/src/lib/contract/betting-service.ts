import { simulateContractCall } from "./soroban-client";

export interface PlaceBetParams {
  marketId: number;
  bettor: string;
  outcomeIndex: number;
  amount: number;
}

export async function placeBet(params: PlaceBetParams): Promise<void> {
  try {
    await simulateContractCall("place_bet", [
      params.marketId,
      params.bettor,
      params.outcomeIndex,
      params.amount,
    ]);
  } catch (error) {
    console.error("Error placing bet:", error);
    throw error;
  }
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

export async function getUserBet(
  marketId: number,
  bettor: string
): Promise<{ outcomeIndex: number; amount: number } | null> {
  try {
    const result = await simulateContractCall("get_bet", [marketId, bettor]);

    if (!result) {
      return null;
    }

    const betData = result as { outcome_index?: number | bigint; amount?: number | bigint };
    return {
      outcomeIndex:
        typeof betData.outcome_index === "number"
          ? betData.outcome_index
          : Number(betData.outcome_index || 0),
      amount:
        typeof betData.amount === "number"
          ? betData.amount
          : Number(betData.amount || 0),
    };
  } catch (error) {
    console.error("Error fetching user bet:", error);
    return null;
  }
}
