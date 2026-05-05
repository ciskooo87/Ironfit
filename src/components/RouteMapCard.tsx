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

function buildSvgGeometry(points: LatLngTuple[]) {
  if (points.length < 2) return undefined;

  const lats = points.map(([lat]) => lat);
  const lngs = points.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const width = 1000;
  const height = 420;
  const padding = 40;
  const latRange = Math.max(maxLat - minLat, 0.0001);
  const lngRange = Math.max(maxLng - minLng, 0.0001);

  const scaled = points.map(([lat, lng]) => {
    const x = padding + ((lng - minLng) / lngRange) * (width - padding * 2);
    const y = padding + (1 - (lat - minLat) / latRange) * (height - padding * 2);
    return [x, y] as const;
  });

  const path = scaled.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return { path, scaled, width, height };
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
  const geometry = buildSvgGeometry(points);
  const hasRoute = Boolean(geometry?.path);
  const start = geometry?.scaled[0];
  const end = geometry?.scaled[geometry.scaled.length - 1];

  return (
    <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/50 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Mapa</div>
      <div className="mt-3 overflow-hidden rounded-[22px] border border-emerald-100 bg-white">
        {hasRoute && geometry ? (
          <svg viewBox={`0 0 ${geometry.width} ${geometry.height}`} className="h-[360px] w-full bg-[linear-gradient(180deg,#f8fffb_0%,#effcf3_100%)]" role="img" aria-label={`Mapa da rota ${title || "selecionada"}`}>
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#d6efe0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={geometry.width} height={geometry.height} fill="url(#grid)" />
            <path d={geometry.path} fill="none" stroke="#a7f3d0" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
            <path d={geometry.path} fill="none" stroke="#10b981" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            {start ? <circle cx={start[0]} cy={start[1]} r="10" fill="#047857" /> : null}
            {end ? <circle cx={end[0]} cy={end[1]} r="10" fill="#065f46" /> : null}
            {start ? <text x={start[0] + 16} y={start[1] - 10} fontSize="18" fill="#065f46" fontWeight="700">Início</text> : null}
            {end ? <text x={end[0] + 16} y={end[1] - 10} fontSize="18" fill="#065f46" fontWeight="700">Fim</text> : null}
          </svg>
        ) : (
          <div className="flex h-[360px] items-center justify-center bg-[linear-gradient(180deg,#f8fffb_0%,#effcf3_100%)] px-6 text-center text-sm text-emerald-800">
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
