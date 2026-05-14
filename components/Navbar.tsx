"use client";

import { useTradeFlowStore } from "@/store/useTradeFlowStore";

export function Navbar() {
  const { role, setRole, resetDemo } = useTradeFlowStore();
  const roles = ["exporter", "buyer", "verifier"] as const;

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-field text-xl font-black text-white shadow-glow">TF</span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-field">TradeFlow</p>
            <h1 className="text-xl font-black text-ink">Agricultural export payment rail</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/70 bg-white/80 p-1 shadow-sm">
        {roles.map((item) => (
          <button
            key={item}
            onClick={() => setRole(item)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              role === item ? "bg-field text-white" : "text-slate-600 hover:bg-cream"
            }`}
          >
            {item}
          </button>
        ))}
        <button onClick={resetDemo} className="rounded-full px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50">
          Reset demo
        </button>
      </div>
    </header>
  );
}
