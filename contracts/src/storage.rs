use crate::{betting::Bet, market::Market, resolution::MarketResult};
use soroban_sdk::{contracttype, Address, Env, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Market(u64),
    MarketCounter,
    Bet(u64, Address),
    MarketPool(u64),
    MarketResult(u64),
    MarketBettors(u64),
    RewardClaimed(u64, Address),
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

pub fn add_market_bettor(env: &Env, market_id: u64, bettor: &Address) {
    let mut bettors = get_market_bettors(env, market_id);
    bettors.push_back(bettor.clone());

    env.storage()
        .persistent()
        .set(&DataKey::MarketBettors(market_id), &bettors);
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

pub fn save_market_result(env: &Env, market_id: u64, result: &MarketResult) {
    env.storage()
        .persistent()
        .set(&DataKey::MarketResult(market_id), result);
}

pub fn get_market_result(env: &Env, market_id: u64) -> Option<MarketResult> {
    env.storage()
        .persistent()
        .get(&DataKey::MarketResult(market_id))
}

pub fn get_market_bettors(env: &Env, market_id: u64) -> Vec<Address> {
    env.storage()
        .persistent()
        .get(&DataKey::MarketBettors(market_id))
        .unwrap_or_else(|| Vec::new(env))
}

pub fn mark_reward_claimed(env: &Env, market_id: u64, bettor: &Address) {
    env.storage()
        .persistent()
        .set(&DataKey::RewardClaimed(market_id, bettor.clone()), &true);
}

pub fn is_reward_claimed(env: &Env, market_id: u64, bettor: &Address) -> bool {
    env.storage()
        .persistent()
        .get(&DataKey::RewardClaimed(market_id, bettor.clone()))
        .unwrap_or(false)
}
