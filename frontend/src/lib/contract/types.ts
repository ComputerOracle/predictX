export interface Market {
  id: number;
  creator: string;
  title: string;
  description: string;
  end_time: number;
  outcomes: string[];
  resolved: boolean;
}

export interface ContractError {
  code: string;
  message: string;
}

export enum MarketStatus {
  Active = "Active",
  Ended = "Ended",
  Resolved = "Resolved",
}
