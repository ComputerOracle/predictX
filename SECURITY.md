# Security Policy

PredictX handles smart contracts, wallet flows, and eventual user funds. Security reports are taken seriously.

## Supported Versions

This scaffold is pre-release. Security fixes target the active `main` branch until versioned releases begin.

## Reporting a Vulnerability

Please do not disclose vulnerabilities publicly before maintainers have reviewed them.

Send a private report to the maintainers with:

- A clear description of the issue
- Reproduction steps or proof of concept
- Affected files, contracts, or wallet flows
- Suggested remediation, if known

## Security Expectations

- Never commit secrets or private keys.
- Keep contract arithmetic checked.
- Validate all external inputs at contract boundaries.
- Treat wallet connection state as untrusted until verified.
- Add tests for permission checks and failure paths when business logic is introduced.

