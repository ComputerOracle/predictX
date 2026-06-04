"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import clsx from "clsx";
import { useWallet } from "@/lib/wallet/use-wallet";
import { createMarket } from "@/lib/contract/create-market-service";

interface FormState {
  title: string;
  description: string;
  endDateTime: string;
  outcomes: string[];
}

interface FormErrors {
  title?: string;
  description?: string;
  endDateTime?: string;
  outcomes?: string;
}

export function CreateMarketForm() {
  const router = useRouter();
  const { isConnected, publicKey } = useWallet();

  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    endDateTime: "",
    outcomes: ["", ""],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formState.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formState.endDateTime) {
      newErrors.endDateTime = "End date and time is required";
    } else {
      const endTime = new Date(formState.endDateTime).getTime();
      const now = Date.now();
      if (endTime <= now) {
        newErrors.endDateTime = "End date must be in the future";
      }
    }

    const filledOutcomes = formState.outcomes.filter((o) => o.trim());
    if (filledOutcomes.length < 2) {
      newErrors.outcomes = "Minimum 2 outcomes required";
    }

    // Check for duplicate outcomes
    if (filledOutcomes.length !== new Set(filledOutcomes).size) {
      newErrors.outcomes = "Outcomes must be unique";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, title: e.target.value }));
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, description: e.target.value }));
    if (errors.description)
      setErrors((prev) => ({ ...prev, description: undefined }));
  };

  const handleEndDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, endDateTime: e.target.value }));
    if (errors.endDateTime)
      setErrors((prev) => ({ ...prev, endDateTime: undefined }));
  };

  const handleOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...formState.outcomes];
    newOutcomes[index] = value;
    setFormState((prev) => ({ ...prev, outcomes: newOutcomes }));
    if (errors.outcomes) setErrors((prev) => ({ ...prev, outcomes: undefined }));
  };

  const addOutcome = () => {
    setFormState((prev) => ({
      ...prev,
      outcomes: [...prev.outcomes, ""],
    }));
  };

  const removeOutcome = (index: number) => {
    if (formState.outcomes.length > 2) {
      const newOutcomes = formState.outcomes.filter((_, i) => i !== index);
      setFormState((prev) => ({ ...prev, outcomes: newOutcomes }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    if (!isConnected) {
      setSubmitError("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);

    try {
      const endTime = Math.floor(new Date(formState.endDateTime).getTime() / 1000);
      const filledOutcomes = formState.outcomes.filter((o) => o.trim());

      const marketId = await createMarket({
        title: formState.title.trim(),
        description: formState.description.trim(),
        endTime,
        outcomes: filledOutcomes,
      });

      setSuccessMessage(`Market created successfully! ID: ${marketId}`);

      setTimeout(() => {
        router.push("/markets");
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create market";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <h3 className="font-semibold text-yellow-900">Wallet Connection Required</h3>
        <p className="mt-2 text-sm text-yellow-700">
          Please connect your Freighter wallet to create a new market.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">{successMessage}</p>
          <p className="mt-1 text-xs text-green-600">
            Redirecting to markets...
          </p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ink">
          Market Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g., Will Bitcoin reach $100k by end of 2024?"
          value={formState.title}
          onChange={handleTitleChange}
          disabled={isSubmitting}
          className={clsx(
            "mt-2 w-full rounded-md border px-4 py-2 text-sm transition-colors",
            errors.title
              ? "border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none"
              : "border-slate-300 bg-white text-ink placeholder-slate-400 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          )}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-ink"
        >
          Description
        </label>
        <textarea
          id="description"
          placeholder="Provide context and details about this market..."
          value={formState.description}
          onChange={handleDescriptionChange}
          disabled={isSubmitting}
          rows={4}
          className={clsx(
            "mt-2 w-full rounded-md border px-4 py-2 text-sm transition-colors",
            errors.description
              ? "border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none"
              : "border-slate-300 bg-white text-ink placeholder-slate-400 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          )}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="endDateTime"
          className="block text-sm font-medium text-ink"
        >
          Resolution End Date & Time
        </label>
        <input
          id="endDateTime"
          type="datetime-local"
          value={formState.endDateTime}
          onChange={handleEndDateTimeChange}
          disabled={isSubmitting}
          className={clsx(
            "mt-2 w-full rounded-md border px-4 py-2 text-sm transition-colors",
            errors.endDateTime
              ? "border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:outline-none"
              : "border-slate-300 bg-white text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          )}
        />
        {errors.endDateTime && (
          <p className="mt-1 text-xs text-red-600">{errors.endDateTime}</p>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-medium text-ink">
            Outcomes (Minimum 2)
          </label>
          <button
            type="button"
            onClick={addOutcome}
            disabled={isSubmitting}
            className="text-xs font-medium text-ink hover:underline disabled:opacity-50"
          >
            + Add Outcome
          </button>
        </div>

        <div className="space-y-2">
          {formState.outcomes.map((outcome, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder={`Outcome ${index + 1}`}
                value={outcome}
                onChange={(e) => handleOutcomeChange(index, e.target.value)}
                disabled={isSubmitting}
                className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-ink placeholder-slate-400 transition-colors focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink disabled:opacity-50"
              />
              {formState.outcomes.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOutcome(index)}
                  disabled={isSubmitting}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.outcomes && (
          <p className="mt-2 text-xs text-red-600">{errors.outcomes}</p>
        )}
      </div>

      <div className="border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={isSubmitting || !isConnected}
          className={clsx(
            "w-full rounded-md px-4 py-3 font-medium transition-colors",
            isSubmitting || !isConnected
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-ink text-white hover:bg-slate-900"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating Market...
            </span>
          ) : (
            "Create Market"
          )}
        </button>
      </div>
    </form>
  );
}
