"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_ASSET_CODE, createDemoShipment, sampleExporterAddress } from "@/lib/demo-data";
import type { Role, Shipment, ShipmentInput, WalletState } from "@/types";

type TradeFlowStore = {
  wallet: WalletState;
  role: Role;
  shipments: Shipment[];
  selectedShipmentId?: string;
  demoMode: boolean;
  setWallet: (wallet: WalletState) => void;
  setRole: (role: Role) => void;
  setSelectedShipment: (shipmentId: string) => void;
  addShipment: (input: ShipmentInput, exporterAddress?: string) => Shipment;
  fundShipment: (shipmentId: string) => void;
  submitProof: (shipmentId: string, milestoneId: 1 | 2, proof: string) => void;
  approveMilestone: (shipmentId: string, milestoneId: 1 | 2, txHash?: string) => void;
  resetDemo: () => void;
};

const initialWallet: WalletState = {
  isConnected: false,
  address: "",
  network: "testnet",
  balances: [],
};

export const useTradeFlowStore = create<TradeFlowStore>()(
  persist(
    (set, get) => ({
      wallet: initialWallet,
      role: "exporter",
      shipments: [createDemoShipment()],
      selectedShipmentId: "TF-COCOA-001",
      demoMode: true,
      setWallet: (wallet) => set({ wallet }),
      setRole: (role) => set({ role }),
      setSelectedShipment: (shipmentId) => set({ selectedShipmentId: shipmentId }),
      addShipment: (input, exporterAddress) => {
        const now = new Date().toISOString();
        const id = `TF-${input.commodity.slice(0, 4).toUpperCase()}-${Math.floor(
          1000 + Math.random() * 9000,
        )}`;
        const firstAmount = Math.round(input.amount * 0.5 * 100) / 100;
        const secondAmount = Math.round((input.amount - firstAmount) * 100) / 100;
        const shipment: Shipment = {
          id,
          commodity: input.commodity,
          quantity: input.quantity,
          amount: input.amount,
          assetCode: DEFAULT_ASSET_CODE,
          buyerAddress: input.buyerAddress,
          exporterAddress: exporterAddress || get().wallet.address || sampleExporterAddress,
          origin: input.origin,
          destination: input.destination,
          escrowId: `escrow_${id.toLowerCase()}_${Date.now()}`,
          status: "created",
          fundedAmount: 0,
          releasedAmount: 0,
          demoMode: true,
          createdAt: now,
          updatedAt: now,
          milestones: [
            {
              id: 1,
              title: "Port clearance approved",
              description: "Release the first tranche once port clearance proof is accepted.",
              releasePercent: 50,
              amount: firstAmount,
              status: "pending",
            },
            {
              id: 2,
              title: "Delivery confirmed",
              description: "Release the final tranche once buyer confirms delivery.",
              releasePercent: 50,
              amount: secondAmount,
              status: "pending",
            },
          ],
        };

        set((state) => ({
          shipments: [shipment, ...state.shipments],
          selectedShipmentId: shipment.id,
        }));
        return shipment;
      },
      fundShipment: (shipmentId) =>
        set((state) => ({
          shipments: state.shipments.map((shipment) =>
            shipment.id === shipmentId
              ? {
                  ...shipment,
                  status: "funded",
                  fundedAmount: shipment.amount,
                  updatedAt: new Date().toISOString(),
                }
              : shipment,
          ),
        })),
      submitProof: (shipmentId, milestoneId, proof) =>
        set((state) => ({
          shipments: state.shipments.map((shipment) =>
            shipment.id === shipmentId
              ? {
                  ...shipment,
                  updatedAt: new Date().toISOString(),
                  milestones: shipment.milestones.map((milestone) =>
                    milestone.id === milestoneId
                      ? { ...milestone, status: "proof-submitted", proof }
                      : milestone,
                  ),
                }
              : shipment,
          ),
        })),
      approveMilestone: (shipmentId, milestoneId, txHash) =>
        set((state) => ({
          shipments: state.shipments.map((shipment) => {
            if (shipment.id !== shipmentId) return shipment;
            const releasedMilestone = shipment.milestones.find((item) => item.id === milestoneId);
            const releasedAmount = shipment.releasedAmount + (releasedMilestone?.amount ?? 0);
            const completed = milestoneId === 2;

            return {
              ...shipment,
              status: completed ? "completed" : "milestone-1-approved",
              releasedAmount,
              updatedAt: new Date().toISOString(),
              milestones: shipment.milestones.map((milestone) =>
                milestone.id === milestoneId
                  ? {
                      ...milestone,
                      status: "released",
                      transactionHash: txHash ?? `demo_release_${Date.now().toString(36)}`,
                    }
                  : milestone,
              ),
            };
          }),
        })),
      resetDemo: () =>
        set({
          wallet: initialWallet,
          role: "exporter",
          shipments: [createDemoShipment()],
          selectedShipmentId: "TF-COCOA-001",
          demoMode: true,
        }),
    }),
    {
      name: "tradeflow-demo-state",
      partialize: (state) => ({
        wallet: state.wallet,
        role: state.role,
        shipments: state.shipments,
        selectedShipmentId: state.selectedShipmentId,
        demoMode: state.demoMode,
      }),
    },
  ),
);
