"use client";

import { useState } from "react";
import { connectFreighter } from "@/lib/wallet";
import { shortAddress } from "@/lib/stellar";
import { useTradeFlowStore } from "@/store/useTradeFlowStore";

export function WalletConnect() {
  const { wallet, setWallet } = useTradeFlowStore();
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    const nextWallet = await connectFreighter();
    setWallet(nextWallet);
    setLoading(false);
  }

  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-field">Freighter wallet</p>
          <p className="mt-1 text-lg font-bold text-ink">
            {wallet.isConnected ? shortAddress(wallet.address) : "Connect to unlock escrow actions"}
          </p>
          <p className="text-sm text-slate-500">Network: {wallet.network || "testnet"}</p>
        </div>
        <button
          onClick={handleConnect}
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-field disabled:cursor-wait disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Connecting…" : wallet.isConnected ? "Refresh wallet" : "Connect Freighter"}
        </button>
      </div>
      {wallet.error ? (
        <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-700">
          {wallet.error} You can still run the hackathon demo with simulated signing.
        </p>
      ) : null}
      {wallet.balances.length ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {wallet.balances.slice(0, 4).map((balance) => (
            <div key={balance.asset} className="rounded-2xl bg-cream px-3 py-2">
              <p className="text-xs text-slate-500">{balance.asset}</p>
              <p className="font-semibold text-ink">{balance.balance}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
