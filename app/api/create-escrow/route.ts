import { NextResponse } from "next/server";
import { createEscrowPayload } from "@/lib/trustlesswork";
import type { ShipmentInput } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as ShipmentInput & { exporterAddress?: string };
  const response = await createEscrowPayload(body, body.exporterAddress ?? "");
  return NextResponse.json(response);
}
