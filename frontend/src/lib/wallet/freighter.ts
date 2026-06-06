import * as FreighterApi from "@stellar/freighter-api";

export type FreighterConnection = {
  publicKey: string;
};

export async function isFreighterInstalled(): Promise<boolean> {
  try {
    return await FreighterApi.isAllowed();
  } catch {
    return false;
  }
}

export async function connectFreighter(): Promise<FreighterConnection | null> {
  try {
    const installed = await isFreighterInstalled();
    if (!installed) {
      throw new Error("Freighter wallet is not installed or not allowed");
    }

    const publicKey = await FreighterApi.getPublicKey();
    if (!publicKey) {
      throw new Error("Failed to retrieve public key from Freighter");
    }

    return { publicKey };
  } catch (error) {
    console.error("Freighter connection error:", error);
    return null;
  }
}

export async function disconnectFreighter(): Promise<void> {
  // Freighter doesn't have explicit disconnect, but we clear local state
  // The wallet remains connected in the extension but our app loses reference
}

export async function signTransaction(
  transactionXdr: string
): Promise<string | null> {
  try {
    const signedTxXdr = await FreighterApi.signTransaction(transactionXdr, {
      networkPassphrase: "Test SDF Network ; September 2015",
    });
    return signedTxXdr;
  } catch (error) {
    console.error("Transaction signing error:", error);
    return null;
  }
}

