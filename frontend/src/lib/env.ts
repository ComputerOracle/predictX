export const STELLAR_NETWORK = {
  name: "Testnet",
  networkPassphrase: "Test SDF Network ; September 2015",
  rpcUrl: "https://soroban-testnet.stellar.org",
};

// NEXT_PUBLIC_ variables are injected at build time by Next.js
const getContractId = () => {
  // @ts-expect-error - process.env is injected by Next.js
  return typeof process !== "undefined" ? process.env.NEXT_PUBLIC_CONTRACT_ID : "";
};

export const CONTRACT_ID = getContractId() || "";
