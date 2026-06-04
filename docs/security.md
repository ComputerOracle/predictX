# Security Notes

PredictX is pre-logic scaffold code. Security work should begin before market custody, staking, and reward behavior is implemented.

## Contract Security Checklist

- Define explicit authorization rules.
- Reject invalid market state transitions.
- Keep arithmetic checked and tested.
- Emit events for externally meaningful state changes.
- Add tests for replay, double-claim, and invalid-resolution paths.
- Keep storage keys stable and documented.

## Frontend Security Checklist

- Treat wallet state as untrusted until verified.
- Show network and contract ID clearly before signing.
- Avoid storing sensitive wallet data.
- Validate all user input before transaction assembly.
- Provide transaction preview and failure feedback.

## Supply Chain

- Keep dependencies minimal.
- Review dependency updates before merging.
- Run CI on pull requests.
- Enable Dependabot for Rust and npm packages.

