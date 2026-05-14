"use client";

import { FormEvent, useState } from "react";
import { createEscrowPayload } from "@/lib/trustlesswork";
import { sampleBuyerAddress } from "@/lib/demo-data";
import { useTradeFlowStore } from "@/store/useTradeFlowStore";

const initialForm = {
  commodity: "Sesame seeds",
  quantity: "18 metric tons",
  amount: "36000",
  buyerAddress: sampleBuyerAddress,
  origin: "Kano, Nigeria",
  destination: "Dubai, UAE",
};

export function CreateShipmentForm() {
  const { addShipment, wallet } = useTradeFlowStore();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const input = { ...form, amount: Number(form.amount) };
    const response = await createEscrowPayload(input, wallet.address);
    const shipment = addShipment(input, wallet.address);
    setMessage(`${response.message} Shipment ${shipment.id} is ready for buyer funding.`);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-field">Create shipment</p>
        <h2 className="text-2xl font-black text-ink">Open a two-tranche escrow</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["commodity", "Commodity"],
          ["quantity", "Quantity"],
          ["amount", "Amount (USDC)"],
          ["buyerAddress", "Buyer Stellar address"],
          ["origin", "Origin"],
          ["destination", "Destination"],
        ].map(([key, label]) => (
          <label key={key} className={key === "buyerAddress" ? "sm:col-span-2" : ""}>
            <span className="text-sm font-semibold text-slate-600">{label}</span>
            <input
              value={form[key as keyof typeof form]}
              onChange={(event) => setForm((state) => ({ ...state, [key]: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-cream px-4 py-3 outline-none transition focus:border-field focus:bg-white"
              type={key === "amount" ? "number" : "text"}
              required
            />
          </label>
        ))}
      </div>
      {!wallet.isConnected ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-700">
          Wallet is not connected. The MVP will still create demo escrows, but live signing needs Freighter.
        </p>
      ) : null}
      {message ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{message}</p> : null}
      <button
        disabled={loading}
        className="mt-5 w-full rounded-full bg-field px-5 py-3 font-bold text-white transition hover:bg-ink disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Creating escrow…" : "Create shipment escrow"}
      </button>
    </form>
  );
}
