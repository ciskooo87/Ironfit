"use client";

import dynamic from "next/dynamic";

const RouteMapLeaflet = dynamic(() => import("@/components/RouteMapLeaflet").then((mod) => mod.RouteMapLeaflet), {
  ssr: false,
});

export function RouteMapCard({
  title,
  summary,
  polyline,
  locationLabel,
}: {
  title?: string;
  summary: string;
  polyline?: string;
  locationLabel?: string;
}) {
  return (
    <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/50 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Mapa</div>
      <RouteMapLeaflet polylineText={polyline} locationLabel={locationLabel} />
      <div className="mt-3 rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-sm leading-6 text-emerald-900">
        <div className="font-semibold text-emerald-950">{title || "Mapa da rota"}</div>
        <div className="mt-2">{summary}</div>
        <div className="mt-3 text-xs text-emerald-700">
          {polyline ? "Mapa interativo renderizado com a polyline da rota." : "Ainda sem polyline real. O mapa está centralizado na localização pesquisada para não ficar cego."}
        </div>
      </div>
    </div>
  );
}
