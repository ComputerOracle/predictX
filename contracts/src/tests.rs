use super::{PredictXContract, PredictXContractClient};
use crate::{
    errors::PredictXError,
    market::Market,
    storage::{get_market, get_next_market_id, save_market},
};
use soroban_sdk::{testutils::Address as _, vec, Address, Env, String};

#[test]
fn exposes_contract_version() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());
    let client = PredictXContractClient::new(&env, &contract_id);

    assert_eq!(client.version(), String::from_str(&env, "0.1.0"));
}

#[test]
fn increments_market_ids_from_one() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        assert_eq!(get_next_market_id(&env), 1);
        assert_eq!(get_next_market_id(&env), 2);
        assert_eq!(get_next_market_id(&env), 3);
    });
}

#[test]
fn saves_and_loads_market_by_id() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());
    let creator = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = get_next_market_id(&env);
        let market = Market {
            id: market_id,
            creator,
            title: String::from_str(&env, "Will PredictX launch on testnet?"),
            description: String::from_str(&env, "Placeholder market model test."),
            end_time: 1_789_000_000,
            outcomes: vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
            resolved: false,
        };

        save_market(&env, &market);

        assert_eq!(get_market(&env, market_id), Some(market));
    });
}

#[test]
fn returns_none_for_missing_market() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        assert_eq!(get_market(&env, 404), None);
    });
}

#[test]
fn creates_market_successfully() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        let outcomes = vec![
            &env,
            String::from_str(&env, "Yes"),
            String::from_str(&env, "No"),
        ];
        let market_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "Will PredictX launch on testnet?"),
            String::from_str(&env, "A scaffolded market creation test."),
            env.ledger().timestamp() + 1,
            outcomes.clone(),
        )
        .unwrap();

        let market = get_market(&env, market_id).unwrap();

        assert_eq!(market.id, market_id);
        assert_eq!(market.creator, env.current_contract_address());
        assert_eq!(
            market.title,
            String::from_str(&env, "Will PredictX launch on testnet?")
        );
        assert_eq!(
            market.description,
            String::from_str(&env, "A scaffolded market creation test.")
        );
        assert_eq!(market.end_time, env.ledger().timestamp() + 1);
        assert_eq!(market.outcomes, outcomes);
        assert!(!market.resolved);
    });
}

#[test]
fn rejects_empty_title() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        let result = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, ""),
            String::from_str(&env, "A valid description."),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        );

        assert_eq!(result, Err(PredictXError::EmptyTitle));
    });
}

#[test]
fn rejects_empty_description() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        let result = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "A valid title"),
            String::from_str(&env, ""),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        );

        assert_eq!(result, Err(PredictXError::EmptyDescription));
    });
}

#[test]
fn rejects_invalid_outcome_count() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        let result = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "A valid title"),
            String::from_str(&env, "A valid description."),
            env.ledger().timestamp() + 1,
            vec![&env, String::from_str(&env, "Only one outcome")],
        );

        assert_eq!(result, Err(PredictXError::InvalidOutcomeCount));
    });
}

#[test]
fn rejects_invalid_end_time() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        let result = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "A valid title"),
            String::from_str(&env, "A valid description."),
            env.ledger().timestamp(),
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        );

        assert_eq!(result, Err(PredictXError::InvalidEndTime));
    });
}
