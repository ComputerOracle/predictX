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
    storage::{get_next_market_id, save_market},
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
}

#[cfg(test)]
mod tests;
