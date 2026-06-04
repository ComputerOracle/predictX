# PredictX

**Decentralized Prediction Marketplace on Stellar**

PredictX is an open-source prediction marketplace scaffold built for the Stellar network with Soroban smart contracts, a TypeScript Next.js frontend, and wallet integration placeholders.

This repository currently contains project structure, starter files, documentation, CI, and deployment placeholders only. Prediction market business logic has intentionally not been implemented yet.

## Stack

- Rust Soroban smart contracts
- Soroban SDK `26.0.1`
- Next.js, TypeScript, and TailwindCSS
- Freighter wallet integration placeholders
- Stellar Wallet Kit integration placeholders
- GitHub Actions for CI and security checks

## Repository Structure

```text
.github/        Workflows, Dependabot, and community templates
contracts/      Soroban smart contract crate
frontend/       Next.js application
docs/           Architecture, roadmap, deployment, and security docs
scripts/        Deployment and automation placeholders
tests/          Cross-system integration test placeholders
```

## Getting Started

```bash
npm install
rustup target add wasm32-unknown-unknown
npm run contracts:build
npm run dev
```

## Status

MVP scaffold. Business logic for market creation, betting, resolution, and rewards will be added in later milestones.

## Documentation

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Deployment](docs/deployment.md)
- [Security](docs/security.md)

## Contributing

Contributions are welcome.

Please review the CONTRIBUTING.md guidelines before opening issues or pull requests.

## License

MIT. See [LICENSE](LICENSE).

