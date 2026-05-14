import type { Shipment } from "@/types";

const statusCopy: Record<Shipment["status"], string> = {
  draft: "Draft",
  created: "Escrow created",
  funded: "Funded",
  "milestone-1-approved": "First tranche released",
  completed: "Completed",
};

export function EscrowStatus({ shipment }: { shipment: Shipment }) {
  const progress = shipment.amount ? Math.round((shipment.releasedAmount / shipment.amount) * 100) : 0;

  return (
    <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-field">Escrow status</p>
          <h3 className="mt-1 text-2xl font-black text-ink">{statusCopy[shipment.status]}</h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          {shipment.demoMode ? "Demo-safe" : "Live testnet"}
        </span>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-field transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-slate-500">Escrowed</p>
          <p className="font-bold">{shipment.fundedAmount.toLocaleString()} {shipment.assetCode}</p>
        </div>
        <div>
          <p className="text-slate-500">Released</p>
          <p className="font-bold">{shipment.releasedAmount.toLocaleString()} {shipment.assetCode}</p>
        </div>
        <div>
          <p className="text-slate-500">Remaining</p>
          <p className="font-bold">{(shipment.amount - shipment.releasedAmount).toLocaleString()} {shipment.assetCode}</p>
        </div>
      </div>
    </div>
  );
}
