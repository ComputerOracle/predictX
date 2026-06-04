# PredictX Architecture

PredictX is structured as a Soroban-first application with a TypeScript frontend and deployment tooling kept separate from contract code.

## Components

- `contracts/`: Rust smart contract crate compiled to `wasm32-unknown-unknown`.
- `frontend/`: Next.js application for market browsing, wallet connection, and future user flows.
- `scripts/`: Deployment and operational automation placeholders.
- `tests/`: Cross-system integration test placeholders.
- `.github/`: CI, security automation, and repository health files.

## Contract Modules

- `market.rs`: market type placeholders
- `betting.rs`: betting type placeholders
- `resolution.rs`: resolution status placeholders
- `rewards.rs`: reward status placeholders
- `storage.rs`: storage key placeholders
- `events.rs`: event helper placeholders
- `errors.rs`: shared contract error placeholders

No market lifecycle, custody, payout, or oracle behavior is implemented in this scaffold.

## Frontend Boundaries

Wallet integration files are present under `frontend/src/lib/wallet/` but return placeholder values until UX, authorization, and transaction flows are specified.

