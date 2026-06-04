use super::{PredictXContract, PredictXContractClient};
use soroban_sdk::{Env, String};

#[test]
fn exposes_contract_version() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());
    let client = PredictXContractClient::new(&env, &contract_id);

    assert_eq!(client.version(), String::from_str(&env, "0.1.0"));
}
