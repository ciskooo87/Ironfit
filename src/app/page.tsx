import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { recommendRoutes } from "@/lib/route-engine";
import { normalizeInput, preferenceOptions, trainingOptions } from "@/lib/routefit-data";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const input = normalizeInput(await searchParams);
  const recommendationResult = await recommendRoutes(input);
  const routes = recommendationResult.recommendations;

  return (
    <AppShell>
      <main className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">MVP</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">Gerar a melhor rota para o treino de hoje</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            O RouteFit AI recomenda 3 rotas: melhor geral, performance e mais segura. O foco agora é execução rápida com score simples e leitura clara.
          </p>

          <form className="mt-6 grid gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Localização</label>
              <input name="location" defaultValue={input.location} placeholder="Ex.: Ibirapuera, São Paulo" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Data</label>
                <input type="date" name="date" defaultValue={input.date} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Horário</label>
                <input type="time" name="time" defaultValue={input.time} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Modalidade</label>
                <select name="modality" defaultValue={input.modality} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100">
                  <option value="corrida">Corrida</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Distância</label>
                <input type="number" step="0.1" min="1" name="distance" defaultValue={input.distance} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Tipo de treino</label>
              <select name="trainingType" defaultValue={input.trainingType} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100">
                {trainingOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Preferências</label>
              <div className="grid gap-2 md:grid-cols-2">
                {preferenceOptions.map((item) => {
                  const checked = input.preferences.includes(item);
                  return (
                    <label key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200">
                      <input type="checkbox" name="pref" value={item} defaultChecked={checked} className="size-4" />
                      {item}
                    </label>
                  );
                })}
              </div>
              <input type="hidden" name="preferences" value={input.preferences.join(",")} />
            </div>

            <button className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
              Gerar 3 rotas recomendadas
            </button>
          </form>
        </section>

        <section className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Input atual</div>
              <div className="mt-3 text-lg font-semibold text-white">{input.location}</div>
              <div className="mt-2 text-sm text-slate-300">{input.date} · {input.time}</div>
              <div className="mt-2 text-sm text-slate-300">{input.modality} · {input.distance} km · {input.trainingType}</div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Provider atual</div>
              <div className="mt-3 text-sm leading-7 text-slate-300">
                {recommendationResult.provider === "mock_rules"
                  ? "Rodando em mock por regras. Falta configurar Google Maps API para candidatas reais."
                  : recommendationResult.provider === "google_maps_fallback"
                    ? "Google Maps já configurado, mas ainda sem geração real de candidatas."
                    : "Google Maps ativo com candidatas reais."}
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Stack do MVP</div>
              <div className="mt-3 text-sm leading-7 text-slate-300">Next.js + Tailwind no front. Próximo bloco: Postgres/PostGIS e camada de rotas com Google Maps API.</div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Request atual</div>
              <div className="mt-3 text-sm leading-7 text-slate-300">ID: {recommendationResult.requestId}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">Candidatas reais: {recommendationResult.candidateCount}</div>
            </div>
          </div>

          {routes.map((route) => (
            <article key={route.id} className="rounded-[30px] border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">{route.kind}</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{route.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{route.recommendationReason}</p>
                </div>
                <div className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Score {route.overallScore}</div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-5">
                <div className="rounded-2xl bg-slate-900 px-4 py-4"><div className="text-[11px] uppercase text-slate-400">Distância</div><div className="mt-2 text-xl font-semibold text-white">{route.distanceKm} km</div></div>
                <div className="rounded-2xl bg-slate-900 px-4 py-4"><div className="text-[11px] uppercase text-slate-400">Tempo</div><div className="mt-2 text-xl font-semibold text-white">{route.estimatedMinutes} min</div></div>
                <div className="rounded-2xl bg-slate-900 px-4 py-4"><div className="text-[11px] uppercase text-slate-400">Elevação</div><div className="mt-2 text-xl font-semibold text-white">{route.elevationGain} m</div></div>
                <div className="rounded-2xl bg-slate-900 px-4 py-4"><div className="text-[11px] uppercase text-slate-400">Segurança</div><div className="mt-2 text-xl font-semibold text-white">{route.safetyScore}</div></div>
                <div className="rounded-2xl bg-slate-900 px-4 py-4"><div className="text-[11px] uppercase text-slate-400">Aderência</div><div className="mt-2 text-xl font-semibold text-white">{route.trainingFitScore}</div></div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.88fr]">
                <div className="rounded-[28px] border border-dashed border-cyan-400/30 bg-slate-900 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mapa</div>
                  <div className="mt-3 rounded-[22px] bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-5 text-sm leading-7 text-slate-300">
                    <div className="font-semibold text-white">Preview da rota recomendada</div>
                    <div className="mt-2">{route.mapSummary}</div>
                    <div className="mt-4 text-xs text-slate-400">No MVP real, este bloco recebe Google Maps com polyline, vias, trânsito e pontos de atenção.</div>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-[28px] bg-slate-900 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Pontos de atenção</div>
                    <div className="mt-3 grid gap-2">
                      {route.attentionPoints.map((point) => (
                        <div key={point} className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-200">{point}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/rotas/${route.id}`} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">Ver detalhe</Link>
                    <Link href="/historico" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100">Salvar / histórico</Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
