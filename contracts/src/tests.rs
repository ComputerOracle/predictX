use super::{PredictXContract, PredictXContractClient};
use crate::{
    betting::Bet,
    errors::PredictXError,
    market::Market,
    storage::{get_market, get_next_market_id, save_bet, save_market},
};
use soroban_sdk::{
    testutils::{Address as _, Ledger as _},
    vec, Address, Env, String,
};

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

#[test]
fn retrieves_existing_market() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        let market_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "Existing market"),
            String::from_str(&env, "A market that should be retrievable."),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        )
        .unwrap();

        let market = PredictXContract::get_market(env.clone(), market_id).unwrap();

        assert_eq!(market.id, market_id);
        assert_eq!(market.title, String::from_str(&env, "Existing market"));
        assert!(!market.resolved);
    });
}

#[test]
fn rejects_missing_market_retrieval() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        let result = PredictXContract::get_market(env.clone(), 404);

        assert_eq!(result, Err(PredictXError::MarketNotFound));
    });
}

#[test]
fn lists_multiple_markets() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        let first_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "First market"),
            String::from_str(&env, "The first market in the list."),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        )
        .unwrap();
        let second_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "Second market"),
            String::from_str(&env, "The second market in the list."),
            env.ledger().timestamp() + 2,
            vec![
                &env,
                String::from_str(&env, "Up"),
                String::from_str(&env, "Down"),
            ],
        )
        .unwrap();

        let markets = PredictXContract::list_markets(env.clone());

        assert_eq!(markets.len(), 2);
        assert_eq!(markets.get(0).unwrap().id, first_id);
        assert_eq!(markets.get(1).unwrap().id, second_id);
    });
}

#[test]
fn places_bet_successfully() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(PredictXContract, ());
    let bettor = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "Bettable market"),
            String::from_str(&env, "A market that accepts a valid bet."),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        )
        .unwrap();

        let result = PredictXContract::place_bet(env.clone(), market_id, bettor.clone(), 0, 100);

        assert_eq!(result, Ok(()));

        let bet = PredictXContract::get_bet(env.clone(), market_id, bettor).unwrap();
        assert_eq!(bet.market_id, market_id);
        assert_eq!(bet.outcome_index, 0);
        assert_eq!(bet.amount, 100);
        assert_eq!(
            PredictXContract::get_market_pool(env.clone(), market_id),
            100
        );
    });
}

#[test]
fn rejects_bet_for_invalid_market() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(PredictXContract, ());
    let bettor = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let result = PredictXContract::place_bet(env.clone(), 404, bettor, 0, 100);

        assert_eq!(result, Err(PredictXError::MarketNotFound));
    });
}

#[test]
fn rejects_bet_for_invalid_outcome() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(PredictXContract, ());
    let bettor = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "Outcome market"),
            String::from_str(&env, "A market with two outcomes."),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        )
        .unwrap();

        let result = PredictXContract::place_bet(env.clone(), market_id, bettor, 2, 100);

        assert_eq!(result, Err(PredictXError::InvalidOutcomeIndex));
    });
}

#[test]
fn rejects_zero_amount_bet() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(PredictXContract, ());
    let bettor = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "Amount market"),
            String::from_str(&env, "A market that rejects zero amount bets."),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        )
        .unwrap();

        let result = PredictXContract::place_bet(env.clone(), market_id, bettor, 0, 0);

        assert_eq!(result, Err(PredictXError::InvalidBetAmount));
    });
}

#[test]
fn rejects_bet_after_market_end() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(PredictXContract, ());
    let bettor = Address::generate(&env);
    let creator = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = get_next_market_id(&env);
        let market = Market {
            id: market_id,
            creator,
            title: String::from_str(&env, "Ended market"),
            description: String::from_str(&env, "A market whose end time has passed."),
            end_time: env.ledger().timestamp(),
            outcomes: vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
            resolved: false,
        };

        save_market(&env, &market);

        let result = PredictXContract::place_bet(env.clone(), market_id, bettor, 0, 100);

        assert_eq!(result, Err(PredictXError::MarketEnded));
    });
}

#[test]
#[should_panic]
fn rejects_unauthorized_bettor() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());
    let bettor = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "Auth market"),
            String::from_str(&env, "A market that requires bettor auth."),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        )
        .unwrap();

        let _ = PredictXContract::place_bet(env.clone(), market_id, bettor, 0, 100);
    });
}

#[test]
fn supports_multiple_bets() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(PredictXContract, ());
    let first_bettor = Address::generate(&env);
    let second_bettor = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "Multi-bet market"),
            String::from_str(&env, "A market that accepts multiple unique bettors."),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        )
        .unwrap();

        assert_eq!(
            PredictXContract::place_bet(env.clone(), market_id, first_bettor.clone(), 0, 100),
            Ok(())
        );
        assert_eq!(
            PredictXContract::place_bet(env.clone(), market_id, second_bettor.clone(), 1, 250),
            Ok(())
        );

        assert_eq!(
            PredictXContract::get_bet(env.clone(), market_id, first_bettor)
                .unwrap()
                .amount,
            100
        );
        assert_eq!(
            PredictXContract::get_bet(env.clone(), market_id, second_bettor)
                .unwrap()
                .amount,
            250
        );
        assert_eq!(
            PredictXContract::get_market_pool(env.clone(), market_id),
            350
        );
    });
}

#[test]
fn rejects_duplicate_bet() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(PredictXContract, ());
    let bettor = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "Duplicate bet market"),
            String::from_str(&env, "A market that rejects duplicate bettor writes."),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        )
        .unwrap();

        let existing_bet = Bet {
            market_id,
            bettor: bettor.clone(),
            outcome_index: 0,
            amount: 100,
        };
        save_bet(&env, &existing_bet);

        assert_eq!(
            PredictXContract::place_bet(env.clone(), market_id, bettor, 1, 200),
            Err(PredictXError::DuplicateBet)
        );
        assert_eq!(PredictXContract::get_market_pool(env.clone(), market_id), 0);
    });
}

#[test]
fn resolves_market_successfully() {
    let env = Env::default();
    env.ledger().set_timestamp(10);
    let contract_id = env.register(PredictXContract, ());
    let creator = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = get_next_market_id(&env);
        let market = Market {
            id: market_id,
            creator,
            title: String::from_str(&env, "Resolution market"),
            description: String::from_str(&env, "A market ready for resolution."),
            end_time: 9,
            outcomes: vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
            resolved: false,
        };
        save_market(&env, &market);

        assert_eq!(
            PredictXContract::resolve_market(env.clone(), market_id, 1),
            Ok(())
        );

        let stored_market = PredictXContract::get_market(env.clone(), market_id).unwrap();
        let result = PredictXContract::get_market_result(env.clone(), market_id).unwrap();

        assert!(stored_market.resolved);
        assert!(result.resolved);
        assert_eq!(result.winning_outcome, Some(1));
    });
}

#[test]
fn rejects_resolution_for_invalid_market() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        let result = PredictXContract::resolve_market(env.clone(), 404, 0);

        assert_eq!(result, Err(PredictXError::MarketNotFound));
    });
}

#[test]
fn rejects_resolution_for_invalid_outcome() {
    let env = Env::default();
    env.ledger().set_timestamp(10);
    let contract_id = env.register(PredictXContract, ());
    let creator = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = get_next_market_id(&env);
        let market = Market {
            id: market_id,
            creator,
            title: String::from_str(&env, "Invalid outcome resolution market"),
            description: String::from_str(&env, "A market with two outcomes."),
            end_time: 9,
            outcomes: vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
            resolved: false,
        };
        save_market(&env, &market);

        let result = PredictXContract::resolve_market(env.clone(), market_id, 2);

        assert_eq!(result, Err(PredictXError::InvalidOutcomeIndex));
    });
}

#[test]
fn rejects_resolution_before_end_time() {
    let env = Env::default();
    let contract_id = env.register(PredictXContract, ());

    env.as_contract(&contract_id, || {
        let market_id = PredictXContract::create_market(
            env.clone(),
            String::from_str(&env, "Early resolution market"),
            String::from_str(&env, "A market that has not ended yet."),
            env.ledger().timestamp() + 1,
            vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
        )
        .unwrap();

        let result = PredictXContract::resolve_market(env.clone(), market_id, 0);

        assert_eq!(result, Err(PredictXError::MarketNotEnded));
    });
}

#[test]
fn rejects_already_resolved_market() {
    let env = Env::default();
    env.ledger().set_timestamp(10);
    let contract_id = env.register(PredictXContract, ());
    let creator = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let market_id = get_next_market_id(&env);
        let market = Market {
            id: market_id,
            creator,
            title: String::from_str(&env, "Already resolved market"),
            description: String::from_str(&env, "A market that resolves once."),
            end_time: 9,
            outcomes: vec![
                &env,
                String::from_str(&env, "Yes"),
                String::from_str(&env, "No"),
            ],
            resolved: false,
        };
        save_market(&env, &market);

        assert_eq!(
            PredictXContract::resolve_market(env.clone(), market_id, 0),
            Ok(())
        );
        assert_eq!(
            PredictXContract::resolve_market(env.clone(), market_id, 1),
            Err(PredictXError::MarketResolved)
        );

        let result = PredictXContract::get_market_result(env.clone(), market_id).unwrap();
        assert_eq!(result.winning_outcome, Some(0));
    });
}
