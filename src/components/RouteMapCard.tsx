import { BASE_PATH } from "@/lib/base-path";

type Props = {
  title?: string;
  summary: string;
  polyline?: string;
  locationLabel?: string;
};

function buildStaticMapUrl(polyline?: string, locationLabel?: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    size: "1200x720",
    scale: "2",
    maptype: "roadmap",
    key: apiKey,
  });

  if (polyline) {
    params.append("path", `weight:6|color:0x10b981|enc:${polyline}`);
  }

  if (locationLabel) {
    params.append("center", locationLabel);
    params.append("zoom", "13");
    params.append("markers", `color:green|${locationLabel}`);
  }

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

export function RouteMapCard({ title, summary, polyline, locationLabel }: Props) {
  const imageUrl = buildStaticMapUrl(polyline, locationLabel);
  const detailUrl = `${BASE_PATH || ""}`;

  return (
    <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/50 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Mapa</div>
      <div className="mt-3 overflow-hidden rounded-[22px] border border-emerald-100 bg-white">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || "Mapa da rota"}
            className="h-[360px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[360px] items-center justify-center bg-[linear-gradient(180deg,#f8fffb_0%,#effcf3_100%)] px-6 text-center text-sm text-emerald-800">
            <div>
              <div className="text-base font-semibold text-emerald-950">Mapa indisponível</div>
              <div className="mt-2 max-w-md">Sem chave pública de mapa para renderizar o fundo em <strong>{locationLabel || "localização informada"}</strong>.</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-sm leading-6 text-emerald-900">
        <div className="font-semibold text-emerald-950">{title || "Mapa da rota"}</div>
        <div className="mt-2">{summary}</div>
        <div className="mt-3 text-xs text-emerald-700">
          {polyline ? "Mapa real renderizado sobre fundo do Google Maps." : "Mapa centralizado na localização pesquisada."}
        </div>
      </div>
    </div>
  );
}
