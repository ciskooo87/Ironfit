import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { normalizeInput } from "@/lib/routefit-data";
import { recommendRoutes } from "@/lib/route-engine";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, string | string[] | undefined>;
  const input = normalizeInput(body);
  const user = await getCurrentUser();
  const result = await recommendRoutes(input, user?.email ?? null);

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
