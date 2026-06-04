"use client";

import { connectFreighter } from "@/lib/wallet/freighter";
import { createWalletKit } from "@/lib/wallet/stellar-wallet-kit";

export function WalletPanel() {
  return (
    <div className="w-full max-w-xl rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Wallets</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Freighter and Stellar Wallet Kit adapters are scaffolded for future
            connection flows.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white"
            onClick={() => void connectFreighter()}
            type="button"
          >
            Freighter Placeholder
          </button>
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-ink"
            onClick={() => void createWalletKit()}
            type="button"
          >
            Wallet Kit Placeholder
          </button>
        </div>
      </div>
    </div>
  );
}

