"use client";

import dynamic from "next/dynamic";

const RouteMapLeaflet = dynamic(() => import("@/components/RouteMapLeaflet").then((mod) => mod.RouteMapLeaflet), {
  ssr: false,
});

export function RouteMapCard({
  title,
  summary,
  polyline,
}: {
  title?: string;
  summary: string;
  polyline?: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-cyan-400/30 bg-slate-900 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mapa</div>
      {polyline ? (
        <>
          <RouteMapLeaflet polylineText={polyline} />
          <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-4 text-sm leading-6 text-slate-300">
            <div className="font-semibold text-white">{title || "Mapa da rota"}</div>
            <div className="mt-2">{summary}</div>
          </div>
        </>
      ) : (
        <div className="mt-3 overflow-hidden rounded-[22px] border border-white/10 bg-slate-950">
          <div className="relative h-[260px] w-full bg-[radial-gradient(circle_at_top,#164e63_0%,#0f172a_45%,#020617_100%)]">
            <svg viewBox="0 0 600 320" className="absolute inset-0 h-full w-full opacity-90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="600" height="320" fill="url(#routeGlow)" />
              <path d="M40 260 C120 120, 200 140, 260 200 S380 280, 560 80" stroke="#1e293b" strokeWidth="18" fill="none" strokeLinecap="round" />
              <path d="M40 260 C120 120, 200 140, 260 200 S380 280, 560 80" stroke="#22d3ee" strokeWidth="8" fill="none" strokeLinecap="round" />
              <circle cx="40" cy="260" r="10" fill="#34d399" />
              <circle cx="560" cy="80" r="10" fill="#f97316" />
              <circle cx="260" cy="200" r="7" fill="#e2e8f0" opacity="0.9" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur">
                <div className="text-sm font-semibold text-white">{title || "Preview da rota recomendada"}</div>
                <div className="mt-2 text-sm leading-6 text-slate-300">{summary}</div>
                <div className="mt-3 text-xs text-slate-400">Ainda sem polyline real para renderizar o mapa interativo desta rota.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
