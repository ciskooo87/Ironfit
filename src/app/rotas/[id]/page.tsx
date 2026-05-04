import { AppShell } from "@/components/AppShell";
import { listSavedRouteRequests } from "@/lib/route-store";

export default async function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requests = await listSavedRouteRequests();
  const route = requests.flatMap((request) => request.recommendations).find((item) => item.id === id);

  if (!route) {
    return (
      <AppShell>
        <main className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8 text-slate-200">
          Rota não encontrada no histórico salvo.
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Detalhe da rota</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white">{route.title}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">{route.recommendationReason}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-slate-900 p-4"><div className="text-xs uppercase text-slate-400">Distância</div><div className="mt-2 text-2xl font-semibold text-white">{route.distanceKm} km</div></div>
            <div className="rounded-2xl bg-slate-900 p-4"><div className="text-xs uppercase text-slate-400">Tempo</div><div className="mt-2 text-2xl font-semibold text-white">{route.estimatedMinutes} min</div></div>
            <div className="rounded-2xl bg-slate-900 p-4"><div className="text-xs uppercase text-slate-400">Elevação</div><div className="mt-2 text-2xl font-semibold text-white">{route.elevationGain} m</div></div>
            <div className="rounded-2xl bg-slate-900 p-4"><div className="text-xs uppercase text-slate-400">Segurança</div><div className="mt-2 text-2xl font-semibold text-white">{route.safetyScore}</div></div>
            <div className="rounded-2xl bg-slate-900 p-4"><div className="text-xs uppercase text-slate-400">Trânsito</div><div className="mt-2 text-2xl font-semibold text-white">{route.trafficScore}</div></div>
            <div className="rounded-2xl bg-slate-900 p-4"><div className="text-xs uppercase text-slate-400">Fluidez</div><div className="mt-2 text-2xl font-semibold text-white">{route.flowScore}</div></div>
          </div>
        </section>

        <aside className="grid gap-6">
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mapa</div>
            <div className="mt-3 rounded-[24px] bg-slate-900 p-5 text-sm leading-7 text-slate-300">
              {route.mapSummary}
              <div className="mt-4 text-xs text-slate-400">Preparado para encaixar Google Maps Directions + polyline + pontos de atenção.</div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Pontos de atenção</div>
            <div className="mt-3 grid gap-2">
              {route.attentionPoints.map((point) => (
                <div key={point} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-200">{point}</div>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </AppShell>
  );
}
