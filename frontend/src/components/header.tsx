"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/lib/wallet/use-wallet";
import clsx from "clsx";

export function Header() {
  const { isConnected, publicKey } = useWallet();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <h1 className="text-xl font-bold text-ink">PredictX</h1>
            <span className="text-sm text-slate-500">Testnet</span>
          </Link>

          <nav className="flex gap-6">
            <Link
              href="/"
              className={clsx(
                "text-sm font-medium transition-colors",
                isActive("/")
                  ? "text-ink border-b-2 border-ink"
                  : "text-slate-600 hover:text-ink"
              )}
            >
              Home
            </Link>
            <Link
              href="/markets"
              className={clsx(
                "text-sm font-medium transition-colors",
                isActive("/markets")
                  ? "text-ink border-b-2 border-ink"
                  : "text-slate-600 hover:text-ink"
              )}
            >
              Markets
            </Link>
          </nav>
        </div>

        {isConnected && publicKey && (
          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-slate-600">
              {`${publicKey.slice(0, 8)}...${publicKey.slice(-8)}`}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
