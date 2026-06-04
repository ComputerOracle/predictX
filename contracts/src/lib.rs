#![no_std]

pub mod betting;
pub mod errors;
pub mod events;
pub mod market;
pub mod resolution;
pub mod rewards;
pub mod storage;

use crate::{
    errors::PredictXError,
    market::Market,
    storage::{get_market as load_market, get_market_count, get_next_market_id, save_market},
};
use soroban_sdk::{contract, contractimpl, Env, String, Vec};

#[contract]
pub struct PredictXContract;

#[contractimpl]
impl PredictXContract {
    pub fn version(env: Env) -> String {
        String::from_str(&env, env!("CARGO_PKG_VERSION"))
    }

    pub fn create_market(
        env: Env,
        title: String,
        description: String,
        end_time: u64,
        outcomes: Vec<String>,
    ) -> Result<u64, PredictXError> {
        if title.len() == 0 {
            return Err(PredictXError::EmptyTitle);
        }

        if description.len() == 0 {
            return Err(PredictXError::EmptyDescription);
        }

        if outcomes.len() < 2 {
            return Err(PredictXError::InvalidOutcomeCount);
        }

        if end_time <= env.ledger().timestamp() {
            return Err(PredictXError::InvalidEndTime);
        }

        let market_id = get_next_market_id(&env);
        let market = Market {
            id: market_id,
            creator: env.current_contract_address(),
            title,
            description,
            end_time,
            outcomes,
            resolved: false,
        };

        save_market(&env, &market);

        Ok(market_id)
    }

    pub fn get_market(env: Env, market_id: u64) -> Result<Market, PredictXError> {
        load_market(&env, market_id).ok_or(PredictXError::MarketNotFound)
    }

    pub fn list_markets(env: Env) -> Vec<Market> {
        let market_count = get_market_count(&env);
        let mut markets = Vec::new(&env);

        for market_id in 1..=market_count {
            if let Some(market) = load_market(&env, market_id) {
                markets.push_back(market);
            }
        }

        markets
    }
}

#[cfg(test)]
mod tests;
