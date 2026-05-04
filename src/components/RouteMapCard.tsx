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
    <div className="rounded-[28px] border border-dashed border-cyan-400/30 bg-slate-900 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mapa</div>
      <RouteMapLeaflet polylineText={polyline} locationLabel={locationLabel} />
      <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-4 text-sm leading-6 text-slate-300">
        <div className="font-semibold text-white">{title || "Mapa da rota"}</div>
        <div className="mt-2">{summary}</div>
        <div className="mt-3 text-xs text-slate-400">
          {polyline ? "Mapa interativo renderizado com a polyline da rota." : "Ainda sem polyline real. O mapa está centralizado na localização pesquisada para não ficar cego."}
        </div>
      </div>
    </div>
  );
}
