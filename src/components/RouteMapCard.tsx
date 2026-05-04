import Image from "next/image";

export function RouteMapCard({
  title,
  summary,
  polyline,
}: {
  title?: string;
  summary: string;
  polyline?: string;
}) {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const staticMapUrl = mapsKey && polyline
    ? `https://maps.googleapis.com/maps/api/staticmap?size=1200x700&scale=2&maptype=roadmap&path=weight:5|color:0x22d3eeff|enc:${encodeURIComponent(polyline)}&key=${mapsKey}`
    : null;

  return (
    <div className="rounded-[28px] border border-dashed border-cyan-400/30 bg-slate-900 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mapa</div>
      {staticMapUrl ? (
        <div className="mt-3 overflow-hidden rounded-[22px] border border-white/10 bg-slate-950">
          <Image
            src={staticMapUrl}
            alt={title || "Mapa da rota"}
            width={1200}
            height={700}
            className="h-auto w-full"
            unoptimized
          />
        </div>
      ) : (
        <div className="mt-3 rounded-[22px] bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-5 text-sm leading-7 text-slate-300">
          <div className="font-semibold text-white">Preview da rota recomendada</div>
          <div className="mt-2">{summary}</div>
          <div className="mt-4 text-xs text-slate-400">Configure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` e gere uma rota com polyline para renderizar o mapa real.</div>
        </div>
      )}
    </div>
  );
}
