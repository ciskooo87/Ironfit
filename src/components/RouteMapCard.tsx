import polyline from "@mapbox/polyline";

type Props = {
  title?: string;
  summary: string;
  polyline?: string;
  locationLabel?: string;
  distanceKm?: number;
  estimatedMinutes?: number;
};

type LatLng = [number, number];

function decodePolyline(polylineText?: string): LatLng[] {
  if (!polylineText) return [];
  try {
    return polyline.decode(polylineText).map(([lat, lng]) => [lat, lng] as LatLng);
  } catch {
    return [];
  }
}

function buildStaticMapUrl(polylineText?: string, locationLabel?: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const points = decodePolyline(polylineText);
  const start = points[0];
  const end = points[points.length - 1];

  const params = new URLSearchParams({
    size: "1200x720",
    scale: "2",
    maptype: "roadmap",
    key: apiKey,
    style: "feature:poi|visibility:simplified",
  });

  if (polylineText) params.append("path", `weight:6|color:0x10b981|enc:${polylineText}`);

  if (start) {
    params.append("markers", `color:green|label:I|${start[0]},${start[1]}`);
  }

  if (end) {
    params.append("markers", `color:red|label:F|${end[0]},${end[1]}`);
  }

  if (!start && locationLabel) {
    params.append("center", locationLabel);
    params.append("zoom", "13");
    params.append("markers", `color:green|${locationLabel}`);
  }

  return {
    url: `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`,
    hasStart: Boolean(start),
    hasEnd: Boolean(end),
  };
}

export function RouteMapCard({ title, summary, polyline: polylineText, locationLabel, distanceKm, estimatedMinutes }: Props) {
  const mapData = buildStaticMapUrl(polylineText, locationLabel);
  const imageUrl = mapData?.url ?? null;

  return (
    <div className="rounded-[30px] border border-emerald-100 bg-white p-4 shadow-[0_16px_50px_rgba(16,24,40,0.06)] md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Mapa da rota</div>
          <div className="mt-1 text-sm text-emerald-800">{locationLabel || "Localização informada"}</div>
        </div>
        <div className="flex gap-2 text-xs font-semibold text-emerald-900">
          {distanceKm ? <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2">{distanceKm} km</span> : null}
          {estimatedMinutes ? <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2">{estimatedMinutes} min</span> : null}
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-[24px] border border-emerald-100 bg-white">
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={title || "Mapa da rota"} className="h-[360px] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/78 via-emerald-950/30 to-transparent p-5 text-white">
              <div className="text-lg font-semibold">{title || "Mapa da rota"}</div>
              <div className="mt-1 max-w-2xl text-sm text-white/90">{summary}</div>
            </div>
          </>
        ) : (
          <div className="flex h-[360px] items-center justify-center bg-[linear-gradient(180deg,#f8fffb_0%,#effcf3_100%)] px-6 text-center text-sm text-emerald-800">
            <div>
              <div className="text-base font-semibold text-emerald-950">Mapa indisponível</div>
              <div className="mt-2 max-w-md">Sem chave pública de mapa para renderizar o fundo em <strong>{locationLabel || "localização informada"}</strong>.</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-4 text-sm leading-6 text-emerald-900">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Leitura do trajeto</div>
          <div className="mt-2">{summary}</div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-sm text-emerald-800">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Início e fim</div>
          <div className="mt-2">
            {mapData?.hasStart || mapData?.hasEnd
              ? "O mapa destaca o início com marcador verde (I) e o fim com marcador vermelho (F)."
              : "Sem geometria suficiente para marcar início e fim nesta resposta."}
          </div>
        </div>
      </div>
    </div>
  );
}
