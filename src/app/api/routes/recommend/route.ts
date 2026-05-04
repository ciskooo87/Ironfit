import { NextResponse } from "next/server";
import { normalizeInput } from "@/lib/routefit-data";
import { recommendRoutes } from "@/lib/route-engine";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, string | string[] | undefined>;
  const input = normalizeInput(body);
  const result = await recommendRoutes(input);

  return NextResponse.json({
    ok: true,
    input,
    requestId: result.requestId,
    provider: result.provider,
    mapsEnabled: result.mapsEnabled,
    candidateCount: result.candidateCount,
    recommendations: result.recommendations,
  });
}
