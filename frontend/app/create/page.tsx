import { CreateMarketForm } from "@/components/create-market-form";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto w-full max-w-2xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-ink">Create Market</h1>
          <p className="text-slate-600">
            Set up a new prediction market and invite traders
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <CreateMarketForm />
        </div>
      </section>
    </main>
  );
}
