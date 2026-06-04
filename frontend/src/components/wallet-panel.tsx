"use client";

import { useWallet } from "@/lib/wallet/use-wallet";

export function WalletPanel() {
  const { isConnected, isLoading, error, publicKey, connect, disconnect } =
    useWallet();

  const displayAddress = publicKey ? `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}` : "";

  return (
    <div className="w-full max-w-xl rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Wallet</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {isConnected ? "Connected to Stellar testnet" : "Connect your Freighter wallet"}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isConnected ? (
          <div className="space-y-3">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-600">Address</p>
              <p className="mt-1 font-mono text-sm text-ink">{displayAddress}</p>
              <p className="mt-1 break-all font-mono text-xs text-slate-500">
                {publicKey}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-700">Connected</span>
              </div>
            </div>
            <button
              className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-ink hover:bg-slate-50"
              onClick={disconnect}
              type="button"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            className="w-full rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
            onClick={connect}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? "Connecting..." : "Connect Freighter"}
          </button>
        )}
      </div>
    </div>
  );
}

