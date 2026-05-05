"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RouteMapCard } from "@/components/RouteMapCard";
import { withBasePath } from "@/lib/base-path";
import { preferenceOptions, RouteInput, RouteRecommendation, trainingOptions } from "@/lib/routefit-data";

type Props = {
  initialInput: RouteInput;
  initialRoutes: RouteRecommendation[];
  initialProvider: string;
  initialRequestId: string;
  initialCandidateCount: number;
};

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[30px] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.06)] ${className}`}>{children}</div>;
}

export function RouteGeneratorClient({
  initialInput,
  initialRoutes,
  initialProvider,
  initialRequestId,
  initialCandidateCount,
}: Props) {
  const [input, setInput] = useState<RouteInput>(initialInput);
  const [routes, setRoutes] = useState<RouteRecommendation[]>(initialRoutes);
  const [provider, setProvider] = useState(initialProvider);
  const [requestId, setRequestId] = useState(initialRequestId);
  const [candidateCount, setCandidateCount] = useState(initialCandidateCount);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function togglePreference(pref: string) {
    setInput((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((item) => item !== pref)
        : [...prev.preferences, pref],
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(withBasePath("/api/routes/recommend"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (data?.ok) {
        setRoutes(data.recommendations || []);
        setProvider(data.provider || "mock_rules");
        setRequestId(data.requestId || "");
        setCandidateCount(Number(data.candidateCount || 0));
        setMessage("Rotas atualizadas com sucesso.");
      } else {
        setMessage("Não foi possível atualizar as rotas agora.");
      }
    } catch {
      setMessage("Falha ao consultar o motor de rotas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Panel>
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Plano do treino</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-emerald-950 md:text-5xl">Monte a melhor rota para hoje</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-800">
          Escolha o local, o objetivo do treino e o contexto desejado. O Ironfit retorna 3 rotas pensadas para performance, segurança e aderência ao treino.
        </p>

        {message ? <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{message}</div> : null}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Localização</label>
            <input value={input.location} onChange={(e) => setInput({ ...input, location: e.target.value })} placeholder="Ex.: Ibirapuera, São Paulo" className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Data</label>
              <input type="date" value={input.date} onChange={(e) => setInput({ ...input, date: e.target.value })} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Horário</label>
              <input type="time" value={input.time} onChange={(e) => setInput({ ...input, time: e.target.value })} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Modalidade</label>
              <select value={input.modality} onChange={(e) => setInput({ ...input, modality: e.target.value as RouteInput['modality'] })} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950">
                <option value="corrida">Corrida</option>
                <option value="bike">Bike</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Distância</label>
              <input type="number" step="0.1" min="1" value={input.distance} onChange={(e) => setInput({ ...input, distance: Number(e.target.value) || 1 })} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Tipo de treino</label>
            <select value={input.trainingType} onChange={(e) => setInput({ ...input, trainingType: e.target.value as RouteInput['trainingType'] })} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950">
              {trainingOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Preferências</label>
            <div className="grid gap-2 md:grid-cols-2">
              {preferenceOptions.map((item) => {
                const checked = input.preferences.includes(item);
                return (
                  <label key={item} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900">
                    <input type="checkbox" checked={checked} onChange={() => togglePreference(item)} className="size-4 accent-emerald-500" />
                    {item}
                  </label>
                );
              })}
            </div>
          </div>

          <button disabled={loading} className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60">
            {loading ? "Gerando rotas..." : "Gerar 3 rotas recomendadas"}
          </button>
        </form>
      </Panel>

      <section className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Panel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Input atual</div>
            <div className="mt-3 text-lg font-semibold text-emerald-950">{input.location}</div>
            <div className="mt-2 text-sm text-emerald-800">{input.date} · {input.time}</div>
            <div className="mt-2 text-sm text-emerald-800">{input.modality} · {input.distance} km · {input.trainingType}</div>
            <div className="mt-3 text-xs text-emerald-700">Preferências: {input.preferences.length ? input.preferences.join(" • ") : "nenhuma"}</div>
          </Panel>
          <Panel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Provider atual</div>
            <div className="mt-3 text-sm leading-7 text-emerald-800">
              {provider === "mock_rules"
                ? "Rodando em mock por regras."
                : provider === "google_maps_fallback"
                  ? "Google Maps ativo com fallback parcial."
                  : "Google Maps ativo com candidatas reais."}
            </div>
          </Panel>
          <Panel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Leitura rápida</div>
            <div className="mt-3 text-sm leading-7 text-emerald-800">O app compara segurança, aderência ao treino, fluidez, trânsito e popularidade antes de recomendar.</div>
          </Panel>
          <Panel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Request atual</div>
            <div className="mt-3 text-sm leading-7 text-emerald-800">ID: {requestId}</div>
            <div className="mt-2 text-sm leading-7 text-emerald-800">Candidatas reais: {candidateCount}</div>
          </Panel>
        </div>

        {routes.map((route) => (
          <Panel key={route.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">{route.kind}</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-emerald-950">{route.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-800">{route.recommendationReason}</p>
              </div>
              <div className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">Score {route.overallScore}</div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-5">
              {[
                ["Distância", `${route.distanceKm} km`],
                ["Tempo", `${route.estimatedMinutes} min`],
                ["Elevação", `${route.elevationGain} m`],
                ["Segurança", `${route.safetyScore}`],
                ["Aderência", `${route.trainingFitScore}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-4">
                  <div className="text-[11px] uppercase text-emerald-600">{label}</div>
                  <div className="mt-2 text-xl font-semibold text-emerald-950">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.88fr]">
              <RouteMapCard title={route.title} summary={route.mapSummary} polyline={route.polyline} locationLabel={input.location} />
              <div className="grid gap-4">
                <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/50 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Pontos de atenção</div>
                  <div className="mt-3 grid gap-2">
                    {route.attentionPoints.map((point) => (
                      <div key={point} className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-900">{point}</div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    {[
                      ["Trânsito", route.trafficScore],
                      ["Fluidez", route.flowScore],
                      ["Popularidade", route.popularityScore],
                      ["Geometria", route.geometryAvailable ? "sim" : "não"],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-xl border border-emerald-100 bg-white px-3 py-3 text-sm text-emerald-900">
                        {label} <strong className="text-emerald-950">{value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/rotas/${route.id}`} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white">Ver detalhe</Link>
                  <Link href="/historico" className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold text-emerald-900">Salvar / histórico</Link>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </section>
    </main>
  );
}
