export const STELLAR_NETWORK = {
  name: "Testnet",
  networkPassphrase: "Test SDF Network ; September 2015",
  rpcUrl: "https://soroban-testnet.stellar.org",
};

// Access environment variable safely at runtime
// NEXT_PUBLIC_ variables are injected at build time by Next.js
export const CONTRACT_ID = (() => {
  if (typeof globalThis === "undefined") return "";
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.NEXT_PUBLIC_CONTRACT_ID || "";
})();
