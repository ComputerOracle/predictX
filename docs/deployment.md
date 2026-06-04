# Deployment

Deployment scripts are placeholders until contract logic, network configuration, and release policy are finalized.

## Prerequisites

- Rust stable
- `wasm32-unknown-unknown` target
- Stellar CLI
- Node.js 22 or newer
- A funded Stellar testnet account

## Contract Build

```bash
npm run contracts:build
```

Expected artifact:

```text
target/wasm32-unknown-unknown/release/predictx_contracts.wasm
```

## Testnet Deployment Placeholder

```bash
./scripts/deploy-contract.sh testnet
```

Windows:

```powershell
./scripts/deploy-contract.ps1 -Network testnet
```

The scripts currently validate intent and describe the expected deployment steps. They do not deploy production business logic.

