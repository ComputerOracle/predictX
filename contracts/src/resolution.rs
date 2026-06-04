use soroban_sdk::contracttype;

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ResolutionStatus {
    Pending,
    Resolved,
    Disputed,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct MarketResult {
    pub winning_outcome: Option<u32>,
    pub resolved: bool,
}
