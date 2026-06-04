# Contributing to PredictX

Thanks for helping build PredictX. This project is in scaffold stage, so contributions should keep contracts, frontend code, and documentation easy to audit.

## Development Principles

- Keep prediction market business logic out of placeholder modules until the relevant milestone is approved.
- Prefer small, reviewable pull requests.
- Add tests with any behavior change.
- Use explicit types at contract boundaries.
- Avoid introducing dependencies without a clear security and maintenance reason.

## Local Setup

```bash
npm install
rustup target add wasm32-unknown-unknown
npm run contracts:test
npm run lint
```

## Pull Requests

- Describe the user-facing or developer-facing change.
- Link related issues when available.
- Include screenshots for frontend UI changes.
- Include contract test output for Soroban changes.
- Do not include private keys, seed phrases, RPC secrets, or generated wallet credentials.

## Code Style

- Rust: `cargo fmt`, `cargo clippy --workspace --all-targets -- -D warnings`
- TypeScript: strict mode, typed wallet boundaries, no unchecked `any`
- TailwindCSS: prefer tokens and reusable components over one-off styling

