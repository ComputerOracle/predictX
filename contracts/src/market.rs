use soroban_sdk::{contracttype, Address, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Market {
    pub id: u64,
    pub creator: Address,
    pub title: String,
    pub description: String,
    pub end_time: u64,
    pub outcomes: Vec<String>,
    pub resolved: bool,
}
