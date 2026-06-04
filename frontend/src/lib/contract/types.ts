export interface Market {
  id: u64;
  creator: string;
  title: string;
  description: string;
  end_time: u64;
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
