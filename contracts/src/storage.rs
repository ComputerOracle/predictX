use crate::{betting::Bet, market::Market};
use soroban_sdk::{contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Market(u64),
    MarketCounter,
    Bet(u64, Address),
    MarketPool(u64),
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

pub fn save_bet(env: &Env, bet: &Bet) {
    env.storage()
        .persistent()
        .set(&DataKey::Bet(bet.market_id, bet.bettor.clone()), bet);
}

pub fn get_bet(env: &Env, market_id: u64, bettor: &Address) -> Option<Bet> {
    env.storage()
        .persistent()
        .get(&DataKey::Bet(market_id, bettor.clone()))
}

pub fn get_market_pool(env: &Env, market_id: u64) -> i128 {
    env.storage()
        .persistent()
        .get(&DataKey::MarketPool(market_id))
        .unwrap_or(0_i128)
}

pub fn save_market_pool(env: &Env, market_id: u64, amount: i128) {
    env.storage()
        .persistent()
        .set(&DataKey::MarketPool(market_id), &amount);
}
