"use client";

import { FormEvent, useEffect, useState } from "react";
import clsx from "clsx";
import { Market, MarketStatus } from "@/lib/contract/types";
import { useWallet } from "@/lib/wallet/use-wallet";
import { placeBet } from "@/lib/contract/betting-service";
import { getMarketStatus } from "@/lib/contract/market-service";

interface PlaceBetFormProps {
  market: Market;
  onBetSuccess: () => void;
}

interface FormState {
  outcomeIndex: number | null;
  amount: string;
}

interface FormErrors {
  outcomeIndex?: string;
  amount?: string;
}

export function PlaceBetForm({ market, onBetSuccess }: PlaceBetFormProps) {
  const { isConnected, publicKey } = useWallet();
  const [formState, setFormState] = useState<FormState>({
    outcomeIndex: null,
    amount: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMarketClosed, setIsMarketClosed] = useState(false);

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const marketStatus = getMarketStatus(market, now);
    setIsMarketClosed(marketStatus !== MarketStatus.Active);
  }, [market]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formState.outcomeIndex === null) {
      newErrors.outcomeIndex = "Please select an outcome";
    }

    if (!formState.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(formState.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOutcomeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    setFormState((prev) => ({ ...prev, outcomeIndex: isNaN(index) ? null : index }));
    if (errors.outcomeIndex)
      setErrors((prev) => ({ ...prev, outcomeIndex: undefined }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, amount: e.target.value }));
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    if (!isConnected || !publicKey) {
      setSubmitError("Please connect your wallet first");
      return;
    }

    if (isMarketClosed) {
      setSubmitError("This market is no longer accepting bets");
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = Math.floor(parseFloat(formState.amount) * 10000000); // stroops

      await placeBet({
        marketId: market.id,
        bettor: publicKey,
        outcomeIndex: formState.outcomeIndex!,
        amount,
      });

      setSuccessMessage("Bet placed successfully!");
      setFormState({ outcomeIndex: null, amount: "" });

      setTimeout(() => {
        onBetSuccess();
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to place bet";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-700">
          Connect your wallet to place a bet
        </p>
      </div>
    );
  }

  if (isMarketClosed) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          {marketStatus === MarketStatus.Resolved
            ? "This market has been resolved"
            : "This market is no longer accepting bets"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="outcome"
          className="block text-sm font-medium text-ink"
        >
          Select Outcome
        </label>
        <select
          id="outcome"
          value={formState.outcomeIndex ?? ""}
          onChange={handleOutcomeChange}
          disabled={isSubmitting}
          className={clsx(
            "mt-2 w-full rounded-md border px-4 py-2 text-sm transition-colors",
            errors.outcomeIndex
              ? "border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:outline-none"
              : "border-slate-300 bg-white text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          )}
        >
          <option value="">-- Choose an outcome --</option>
          {market.outcomes.map((outcome, idx) => (
            <option key={idx} value={idx}>
              {outcome}
            </option>
          ))}
        </select>
        {errors.outcomeIndex && (
          <p className="mt-1 text-xs text-red-600">{errors.outcomeIndex}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-ink">
          Amount (Stellar)
        </label>
        <input
          id="amount"
          type="number"
          placeholder="0.00"
          step="0.0001"
          min="0"
          value={formState.amount}
          onChange={handleAmountChange}
          disabled={isSubmitting}
          className={clsx(
            "mt-2 w-full rounded-md border px-4 py-2 text-sm transition-colors",
            errors.amount
              ? "border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none"
              : "border-slate-300 bg-white text-ink placeholder-slate-400 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          )}
        />
        {errors.amount && (
          <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={clsx(
          "w-full rounded-md px-4 py-3 font-medium transition-colors",
          isSubmitting
            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
            : "bg-ink text-white hover:bg-slate-900"
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Placing Bet...
          </span>
        ) : (
          "Place Bet"
        )}
      </button>
    </form>
  );
}
