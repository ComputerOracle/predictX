import { simulateContractCall } from "./soroban-client";

export interface CreateMarketParams {
  title: string;
  description: string;
  endTime: number;
  outcomes: string[];
}

export async function createMarket(params: CreateMarketParams): Promise<number> {
  try {
    const result = await simulateContractCall("create_market", [
      params.title,
      params.description,
      params.endTime,
      params.outcomes,
    ]);

    if (typeof result === "number") {
      return result;
    }

    if (typeof result === "bigint") {
      return Number(result);
    }

    throw new Error("Unexpected market ID format from contract");
  } catch (error) {
    console.error("Error creating market:", error);
    throw error;
  }
}
