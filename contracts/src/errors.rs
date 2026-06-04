use soroban_sdk::contracterror;

#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum PredictXError {
    NotImplemented = 1,
    EmptyTitle = 2,
    EmptyDescription = 3,
    InvalidOutcomeCount = 4,
    InvalidEndTime = 5,
    MarketNotFound = 6,
    MarketResolved = 7,
    MarketEnded = 8,
    InvalidBetAmount = 9,
    InvalidOutcomeIndex = 10,
    DuplicateBet = 11,
    BetNotFound = 12,
    MarketPoolOverflow = 13,
    MarketNotEnded = 14,
}
