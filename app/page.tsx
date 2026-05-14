"use client";

import { CreateShipmentForm } from "@/components/CreateShipmentForm";
import { EscrowStatus } from "@/components/EscrowStatus";
import { MilestoneStepper } from "@/components/MilestoneStepper";
import { Navbar } from "@/components/Navbar";
import { ShipmentCard } from "@/components/ShipmentCard";
import { WalletConnect } from "@/components/WalletConnect";
import { buildActionPayload } from "@/lib/trustlesswork";
import { shortAddress } from "@/lib/stellar";
import { useTradeFlowStore } from "@/store/useTradeFlowStore";

export default function Home() {
  const { shipments, selectedShipmentId, fundShipment, role, wallet } = useTradeFlowStore();
  const selectedShipment = shipments.find((shipment) => shipment.id === selectedShipmentId) ?? shipments[0];
  const totalEscrow = shipments.reduce((sum, shipment) => sum + shipment.fundedAmount, 0);
  const totalReleased = shipments.reduce((sum, shipment) => sum + shipment.releasedAmount, 0);

  async function fundSelectedShipment() {
    if (!selectedShipment) return;
    await buildActionPayload(selectedShipment, "fund");
    fundShipment(selectedShipment.id);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(47,107,63,0.18),_transparent_32rem),linear-gradient(135deg,#fff8ed,#f8fafc)]">
      <Navbar />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-ink p-8 text-white shadow-glow">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-300">Stellar testnet escrow</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Pay agricultural exporters as shipment milestones are approved.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              TradeFlow lets a buyer lock stablecoin into escrow, review proof, and release two clean USDC tranches for port clearance and delivery confirmation.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric label="Total in escrow" value={`${totalEscrow.toLocaleString()} USDC`} />
              <Metric label="Released" value={`${totalReleased.toLocaleString()} USDC`} />
              <Metric label="Active shipments" value={shipments.length.toString()} />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <div className="space-y-4">
              {shipments.map((shipment) => <ShipmentCard key={shipment.id} shipment={shipment} />)}
            </div>
            {selectedShipment ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-field">{selectedShipment.id}</p>
                      <h2 className="mt-1 text-3xl font-black text-ink">{selectedShipment.commodity}</h2>
                      <p className="text-slate-500">{selectedShipment.quantity} from {selectedShipment.origin} to {selectedShipment.destination}</p>
                      <p className="mt-2 text-sm text-slate-500">Buyer: {shortAddress(selectedShipment.buyerAddress)}</p>
                    </div>
                    <button
                      onClick={fundSelectedShipment}
                      disabled={selectedShipment.status !== "created" || role !== "buyer"}
                      className="rounded-full bg-harvest px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                    >
                      Buyer fund escrow
                    </button>
                  </div>
                  {selectedShipment.status === "created" && role !== "buyer" ? (
                    <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-700">
                      Switch to Buyer role to fund this escrow, then return to Exporter or Verifier to submit proof.
                    </p>
                  ) : null}
                </div>
                <EscrowStatus shipment={selectedShipment} />
                <MilestoneStepper shipment={selectedShipment} />
              </div>
            ) : null}
          </div>
        </div>
        <aside className="space-y-6">
          <WalletConnect />
          <CreateShipmentForm />
          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-field">Demo script</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
              <li>Exporter creates a shipment escrow.</li>
              <li>Buyer funds USDC into escrow.</li>
              <li>Exporter or verifier submits milestone proof.</li>
              <li>Buyer approves and sees released payment update instantly.</li>
            </ol>
            <p className="mt-4 rounded-2xl bg-cream p-3 text-sm text-slate-600">
              Current role: <span className="font-bold capitalize text-field">{role}</span>. Wallet: {wallet.isConnected ? shortAddress(wallet.address) : "demo mode"}.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
