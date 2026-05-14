export type Role = "exporter" | "buyer" | "verifier";

export type EscrowStatus =
  | "draft"
  | "created"
  | "funded"
  | "milestone-1-approved"
  | "completed";

export type MilestoneStatus = "pending" | "proof-submitted" | "approved" | "released";

export type Milestone = {
  id: 1 | 2;
  title: string;
  description: string;
  releasePercent: number;
  amount: number;
  status: MilestoneStatus;
  proof?: string;
  transactionHash?: string;
};

export type Shipment = {
  id: string;
  commodity: string;
  quantity: string;
  amount: number;
  assetCode: string;
  buyerAddress: string;
  exporterAddress: string;
  origin: string;
  destination: string;
  escrowId: string;
  escrowAddress?: string;
  status: EscrowStatus;
  releasedAmount: number;
  fundedAmount: number;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
  demoMode: boolean;
};

export type WalletState = {
  isConnected: boolean;
  address: string;
  network: string;
  balances: Array<{ asset: string; balance: string }>;
  error?: string;
};

export type ShipmentInput = {
  commodity: string;
  quantity: string;
  amount: number;
  buyerAddress: string;
  origin: string;
  destination: string;
};
