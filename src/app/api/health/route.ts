import { NextResponse } from "next/server";
import { hasDatabaseConfigured } from "@/lib/db";
import { hasGoogleMapsConfigured } from "@/lib/google-maps";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "ironfit",
    googleMapsConfigured: hasGoogleMapsConfigured(),
    databaseConfigured: hasDatabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
}
