export type FreighterConnection = {
  publicKey: string;
};

export async function connectFreighter(): Promise<FreighterConnection | null> {
  // TODO: Wire @stellar/freighter-api once wallet UX and permission checks are defined.
  return null;
}

