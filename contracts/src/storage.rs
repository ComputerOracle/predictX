use crate::market::Market;
use soroban_sdk::{contracttype, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Market(u64),
    MarketCounter,
}

pub fn get_next_market_id(env: &Env) -> u64 {
    let current_id = env
        .storage()
        .instance()
        .get(&DataKey::MarketCounter)
        .unwrap_or(0_u64);
    let next_id = current_id.checked_add(1).expect("market counter overflow");

    env.storage()
        .instance()
        .set(&DataKey::MarketCounter, &next_id);

    next_id
}

pub fn get_market_count(env: &Env) -> u64 {
    env.storage()
        .instance()
        .get(&DataKey::MarketCounter)
        .unwrap_or(0_u64)
}

pub fn save_market(env: &Env, market: &Market) {
    env.storage()
        .persistent()
        .set(&DataKey::Market(market.id), market);
}

pub fn get_market(env: &Env, market_id: u64) -> Option<Market> {
    env.storage().persistent().get(&DataKey::Market(market_id))
}
