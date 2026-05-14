"use client";

import { useTradeFlowStore } from "@/store/useTradeFlowStore";
import type { Shipment } from "@/types";

export function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const { selectedShipmentId, setSelectedShipment } = useTradeFlowStore();
  const releasedPercent = shipment.amount ? Math.round((shipment.releasedAmount / shipment.amount) * 100) : 0;
  const selected = selectedShipmentId === shipment.id;

  return (
    <button
      onClick={() => setSelectedShipment(shipment.id)}
      className={`w-full rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-glow ${
        selected ? "border-field bg-white" : "border-white/70 bg-white/75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-field">{shipment.id}</p>
          <h3 className="mt-1 text-xl font-black text-ink">{shipment.commodity}</h3>
          <p className="text-sm text-slate-500">{shipment.origin} → {shipment.destination}</p>
        </div>
        <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold capitalize text-field">
          {shipment.status.replaceAll("-", " ")}
        </span>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-sm text-slate-500">Escrow amount</p>
          <p className="text-2xl font-black text-ink">{shipment.amount.toLocaleString()} {shipment.assetCode}</p>
        </div>
        <p className="text-sm font-bold text-field">{releasedPercent}% released</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-field" style={{ width: `${releasedPercent}%` }} />
      </div>
    </button>
  );
}
