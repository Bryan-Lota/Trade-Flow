import type { Shipment } from "@/types";

export const DEFAULT_ASSET_CODE = process.env.NEXT_PUBLIC_DEFAULT_ASSET_CODE ?? "USDC";

export const sampleBuyerAddress =
  "GBUYERDEMO6H5D6HG4A6JYB4DJ6ACB2ZTWTFLOW2UY4SHIPMENT7K";

export const sampleExporterAddress =
  "GEXPORTER5D6HG4A6JYB4DJ6ACB2ZTWTFLOW2UY4SHIPMENT";

export const createDemoShipment = (): Shipment => {
  const now = new Date().toISOString();
  return {
    id: "TF-COCOA-001",
    commodity: "Cocoa beans",
    quantity: "24 metric tons",
    amount: 48000,
    assetCode: DEFAULT_ASSET_CODE,
    buyerAddress: sampleBuyerAddress,
    exporterAddress: sampleExporterAddress,
    origin: "Lagos, Nigeria",
    destination: "Rotterdam, Netherlands",
    escrowId: "escrow_demo_cocoa_001",
    escrowAddress: "GESCROWDEMO5D6HG4A6JYB4DJ6ACB2ZTWTFLOW2UY4",
    status: "funded",
    releasedAmount: 0,
    fundedAmount: 48000,
    demoMode: true,
    createdAt: now,
    updatedAt: now,
    milestones: [
      {
        id: 1,
        title: "Port clearance approved",
        description: "Exporter uploads port clearance proof for the first release.",
        releasePercent: 50,
        amount: 24000,
        status: "proof-submitted",
        proof: "Port clearance document #PC-2026-184",
      },
      {
        id: 2,
        title: "Delivery confirmed",
        description: "Buyer confirms delivery and releases the final tranche.",
        releasePercent: 50,
        amount: 24000,
        status: "pending",
      },
    ],
  };
};
