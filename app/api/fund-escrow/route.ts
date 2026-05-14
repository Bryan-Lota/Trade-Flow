import { NextResponse } from "next/server";
import { buildActionPayload } from "@/lib/trustlesswork";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await buildActionPayload(body, "fund");
  return NextResponse.json(response);
}
