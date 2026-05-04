import { NextResponse } from "next/server";
import { hasGoogleMapsConfigured } from "@/lib/google-maps";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "ironfit",
    googleMapsConfigured: hasGoogleMapsConfigured(),
    timestamp: new Date().toISOString(),
  });
}
