export type WalletKitInstance = {
  ready: boolean;
};

export async function createWalletKit(): Promise<WalletKitInstance> {
  // TODO: Configure Stellar Wallet Kit with supported wallets and network metadata.
  return { ready: false };
}

