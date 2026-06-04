use soroban_sdk::{contracttype, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Placeholder(Symbol),
}
