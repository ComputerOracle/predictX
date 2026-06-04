export const stellarConfig = {
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet",
  rpcUrl:
    process.env.NEXT_PUBLIC_STELLAR_RPC_URL ??
    "https://soroban-testnet.stellar.org",
  contractId: process.env.NEXT_PUBLIC_PREDICTX_CONTRACT_ID ?? ""
} as const;

