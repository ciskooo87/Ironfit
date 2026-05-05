import { AppShell } from "@/components/AppShell";
import { RouteMapCard } from "@/components/RouteMapCard";
import { normalizeInput } from "@/lib/routefit-data";
import { recommendRoutes } from "@/lib/route-engine";

export default async function RouteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearch = await searchParams;
  const input = normalizeInput(resolvedSearch);
  const kindFromQuery = Array.isArray(resolvedSearch.kind) ? resolvedSearch.kind[0] : resolvedSearch.kind;
  const result = await recommendRoutes(input);
  const route = result.recommendations.find((item) => item.id === id) || result.recommendations.find((item) => item.kind === kindFromQuery) || result.recommendations[0];

  if (!route) {
    return (
      <AppShell>
        <main className="rounded-[32px] border border-emerald-100 bg-white p-6 text-emerald-900 md:p-8">
          Rota não encontrada para esse conjunto de filtros.
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-emerald-100 bg-white p-6 text-emerald-900 shadow-[0_16px_50px_rgba(16,24,40,0.06)] md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Detalhe da rota</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-emerald-950">{route.title}</h1>
          <p className="mt-4 text-sm leading-7 text-emerald-800">{route.recommendationReason}</p>
          <div className="mt-3 text-xs uppercase tracking-[0.18em] text-emerald-700">Provider: {result.provider} · candidatas reais: {result.candidateCount}</div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900">
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2">{input.modality}</span>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2">{input.distance} km</span>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2">{input.trainingType}</span>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2">{input.date} {input.time}</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><div className="text-xs uppercase text-emerald-600">Distância</div><div className="mt-2 text-2xl font-semibold text-emerald-950">{route.distanceKm} km</div></div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><div className="text-xs uppercase text-emerald-600">Tempo</div><div className="mt-2 text-2xl font-semibold text-emerald-950">{route.estimatedMinutes} min</div></div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><div className="text-xs uppercase text-emerald-600">Elevação</div><div className="mt-2 text-2xl font-semibold text-emerald-950">{route.elevationGain} m</div></div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><div className="text-xs uppercase text-emerald-600">Segurança</div><div className="mt-2 text-2xl font-semibold text-emerald-950">{route.safetyScore}</div></div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><div className="text-xs uppercase text-emerald-600">Trânsito</div><div className="mt-2 text-2xl font-semibold text-emerald-950">{route.trafficScore}</div></div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><div className="text-xs uppercase text-emerald-600">Fluidez</div><div className="mt-2 text-2xl font-semibold text-emerald-950">{route.flowScore}</div></div>
          </div>
        </section>

        <aside className="grid gap-6">
          <RouteMapCard title={route.title} summary={route.mapSummary} polyline={route.polyline} locationLabel={input.location} />

          <section className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.06)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Pontos de atenção</div>
            <div className="mt-3 grid gap-2">
              {route.attentionPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{point}</div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-900">
              <div><strong className="text-emerald-950">Local do request:</strong> {input.location}</div>
              <div className="mt-2"><strong className="text-emerald-950">Preferências:</strong> {input.preferences.length ? input.preferences.join(" • ") : "nenhuma"}</div>
            </div>
          </section>
        </aside>
      </main>
    </AppShell>
  );
}
