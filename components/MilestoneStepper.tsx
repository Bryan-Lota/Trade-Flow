"use client";

import { useState } from "react";
import { buildActionPayload } from "@/lib/trustlesswork";
import { useTradeFlowStore } from "@/store/useTradeFlowStore";
import type { Shipment } from "@/types";

export function MilestoneStepper({ shipment }: { shipment: Shipment }) {
  const { role, submitProof, approveMilestone } = useTradeFlowStore();
  const [busyMilestone, setBusyMilestone] = useState<number | null>(null);

  async function handleSubmitProof(milestoneId: 1 | 2) {
    setBusyMilestone(milestoneId);
    await buildActionPayload(shipment, "verify", milestoneId);
    submitProof(
      shipment.id,
      milestoneId,
      milestoneId === 1 ? "Port clearance certificate uploaded" : "Delivery receipt uploaded",
    );
    setBusyMilestone(null);
  }

  async function handleApprove(milestoneId: 1 | 2) {
    setBusyMilestone(milestoneId);
    const response = await buildActionPayload(shipment, "release", milestoneId);
    approveMilestone(shipment.id, milestoneId, response.transactionHash);
    setBusyMilestone(null);
  }

  return (
    <div className="space-y-4">
      {shipment.milestones.map((milestone, index) => {
        const canSubmit = shipment.status !== "created" && milestone.status === "pending" && role !== "buyer";
        const canApprove = milestone.status === "proof-submitted" && role === "buyer";
        const isDone = milestone.status === "released";

        return (
          <div key={milestone.id} className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
            <div className="flex gap-4">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black ${isDone ? "bg-field text-white" : "bg-cream text-field"}`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-ink">{milestone.title}</h3>
                    <p className="text-sm text-slate-500">{milestone.description}</p>
                  </div>
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-600">
                    {milestone.status.replace("-", " ")}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-cream p-3">
                    <p className="text-xs text-slate-500">Release</p>
                    <p className="font-bold">{milestone.releasePercent}%</p>
                  </div>
                  <div className="rounded-2xl bg-cream p-3">
                    <p className="text-xs text-slate-500">Amount</p>
                    <p className="font-bold">{milestone.amount.toLocaleString()} {shipment.assetCode}</p>
                  </div>
                  <div className="rounded-2xl bg-cream p-3">
                    <p className="text-xs text-slate-500">Proof</p>
                    <p className="truncate font-bold">{milestone.proof ?? "Not submitted"}</p>
                  </div>
                </div>
                {milestone.transactionHash ? (
                  <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                    Release transaction: {milestone.transactionHash}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSubmitProof(milestone.id)}
                    disabled={!canSubmit || busyMilestone === milestone.id}
                    className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    {busyMilestone === milestone.id ? "Submitting…" : "Submit proof"}
                  </button>
                  <button
                    onClick={() => handleApprove(milestone.id)}
                    disabled={!canApprove || busyMilestone === milestone.id}
                    className="rounded-full bg-field px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    {busyMilestone === milestone.id ? "Releasing…" : "Buyer approve & release"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
