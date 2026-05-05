import polyline from "@mapbox/polyline";

type LatLngTuple = [number, number];

function decodePolyline(polylineText?: string): LatLngTuple[] {
  if (!polylineText) return [];
  try {
    return polyline.decode(polylineText).map(([lat, lng]) => [lat, lng] as LatLngTuple);
  } catch {
    return [];
  }
}

function buildSvgPath(points: LatLngTuple[]) {
  if (points.length < 2) return undefined;

  const lats = points.map(([lat]) => lat);
  const lngs = points.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const width = 1000;
  const height = 320;
  const padding = 24;
  const latRange = Math.max(maxLat - minLat, 0.0001);
  const lngRange = Math.max(maxLng - minLng, 0.0001);

  const scaled = points.map(([lat, lng]) => {
    const x = padding + ((lng - minLng) / lngRange) * (width - padding * 2);
    const y = padding + (1 - (lat - minLat) / latRange) * (height - padding * 2);
    return [x, y] as const;
  });

  return scaled.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

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
  const points = decodePolyline(polyline);
  const path = buildSvgPath(points);
  const hasRoute = Boolean(path);

  return (
    <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/50 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Mapa</div>
      <div className="mt-3 overflow-hidden rounded-[22px] border border-emerald-100 bg-white">
        {hasRoute ? (
          <svg viewBox="0 0 1000 320" className="h-[320px] w-full bg-[linear-gradient(180deg,#f8fffb_0%,#effcf3_100%)]" role="img" aria-label={`Mapa da rota ${title || "selecionada"}`}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d7f3df" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="320" fill="url(#grid)" />
            <path d={path} fill="none" stroke="#10b981" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" />
            <path d={path} fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            {points.length ? (
              <>
                <circle cx="40" cy="280" r="0" fill="transparent" />
              </>
            ) : null}
          </svg>
        ) : (
          <div className="flex h-[320px] items-center justify-center bg-[linear-gradient(180deg,#f8fffb_0%,#effcf3_100%)] px-6 text-center text-sm text-emerald-800">
            <div>
              <div className="text-base font-semibold text-emerald-950">Mapa base da região</div>
              <div className="mt-2 max-w-md">Ainda sem polyline real desenhável. A rota está centralizada em <strong>{locationLabel || "localização informada"}</strong>.</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-sm leading-6 text-emerald-900">
        <div className="font-semibold text-emerald-950">{title || "Mapa da rota"}</div>
        <div className="mt-2">{summary}</div>
        <div className="mt-3 text-xs text-emerald-700">
          {hasRoute ? "Mapa estático renderizado a partir da polyline da rota." : "Sem geometria suficiente para desenhar a rota nesta resposta."}
        </div>
      </div>
    </div>
  );
}
