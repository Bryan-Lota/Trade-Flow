import type { Shipment, ShipmentInput } from "@/types";
import { DEFAULT_ASSET_CODE } from "@/lib/demo-data";

type AdapterResponse = {
  ok: boolean;
  escrowId: string;
  unsignedXdr?: string;
  transactionHash?: string;
  demoMode: boolean;
  message: string;
};

const baseUrl =
  process.env.NEXT_PUBLIC_TRUSTLESSWORK_TESTNET_BASE_URL ??
  process.env.NEXT_PUBLIC_TRUSTLESSWORK_BASE_URL ??
  "";

export async function createEscrowPayload(
  input: ShipmentInput,
  exporterAddress: string,
): Promise<AdapterResponse> {
  const escrowId = `escrow_${Date.now()}`;

  if (!baseUrl || !process.env.TRUSTLESSWORK_API_KEY) {
    return {
      ok: true,
      escrowId,
      unsignedXdr: "demo_unsigned_xdr_create_escrow",
      demoMode: true,
      message: "Demo escrow created locally because Trustless Work credentials are not configured.",
    };
  }

  try {
    const response = await fetch(`${baseUrl}/escrows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TRUSTLESSWORK_API_KEY}`,
      },
      body: JSON.stringify({
        ...input,
        exporterAddress,
        assetCode: DEFAULT_ASSET_CODE,
        milestones: [50, 50],
      }),
    });

    if (!response.ok) throw new Error(`Trustless Work returned ${response.status}`);
    const data = await response.json();

    return {
      ok: true,
      escrowId: data.escrowId ?? escrowId,
      unsignedXdr: data.unsignedXdr,
      demoMode: false,
      message: "Escrow payload created with Trustless Work.",
    };
  } catch (error) {
    return {
      ok: true,
      escrowId,
      unsignedXdr: "demo_unsigned_xdr_create_escrow",
      demoMode: true,
      message: error instanceof Error ? error.message : "Trustless Work fallback enabled.",
    };
  }
}

export async function buildActionPayload(
  shipment: Pick<Shipment, "escrowId" | "id">,
  action: "fund" | "verify" | "release",
  milestoneId?: number,
): Promise<AdapterResponse> {
  return {
    ok: true,
    escrowId: shipment.escrowId,
    unsignedXdr: `demo_unsigned_xdr_${action}_${shipment.id}_${milestoneId ?? "all"}`,
    transactionHash: `demo_${action}_${Date.now().toString(36)}`,
    demoMode: true,
    message: `Demo ${action} payload prepared. Replace lib/trustlesswork.ts with live SDK calls for production.`,
  };
}
