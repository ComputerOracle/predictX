#![no_std]

pub mod betting;
pub mod errors;
pub mod events;
pub mod market;
pub mod resolution;
pub mod rewards;
pub mod storage;

use soroban_sdk::{contract, contractimpl, Env, String};

#[contract]
pub struct PredictXContract;

#[contractimpl]
impl PredictXContract {
    pub fn version(env: Env) -> String {
        String::from_str(&env, env!("CARGO_PKG_VERSION"))
    }
}

#[cfg(test)]
mod tests;
