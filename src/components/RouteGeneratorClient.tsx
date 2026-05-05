import Link from "next/link";
import { CurrentLocationField } from "@/components/CurrentLocationField";
import { RouteMapCard } from "@/components/RouteMapCard";
import { withBasePath } from "@/lib/base-path";
import type { IronfitProfile } from "@/lib/profile";
import { preferenceOptions, RouteInput, RouteRecommendation, trainingOptions } from "@/lib/routefit-data";

type Props = {
  initialInput: RouteInput;
  initialRoutes: RouteRecommendation[];
  initialProvider: string;
  initialRequestId: string;
  initialCandidateCount: number;
  activeProfile: IronfitProfile;
};

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[30px] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.06)] ${className}`}>{children}</div>;
}

function kindTheme(kind: RouteRecommendation["kind"]) {
  if (kind === "Performance") {
    return {
      badge: "bg-cyan-500 text-white",
      chip: "border-cyan-100 bg-cyan-50 text-cyan-800",
      border: "border-cyan-200",
      ring: "shadow-[0_18px_44px_rgba(6,182,212,0.10)]",
    };
  }
  if (kind === "Mais segura") {
    return {
      badge: "bg-emerald-500 text-white",
      chip: "border-emerald-100 bg-emerald-50 text-emerald-800",
      border: "border-emerald-200",
      ring: "shadow-[0_18px_44px_rgba(16,185,129,0.10)]",
    };
  }
  return {
    badge: "bg-lime-500 text-emerald-950",
    chip: "border-lime-100 bg-lime-50 text-lime-900",
    border: "border-lime-200",
    ring: "shadow-[0_18px_44px_rgba(132,204,22,0.10)]",
  };
}

function detailHref(route: RouteRecommendation, input: RouteInput) {
  const prefs = input.preferences.map((pref) => `preferences=${encodeURIComponent(pref)}`).join("&");
  return withBasePath(
    `/rotas/${route.id}?location=${encodeURIComponent(input.location)}&date=${encodeURIComponent(input.date)}&time=${encodeURIComponent(input.time)}&modality=${encodeURIComponent(input.modality)}&distance=${encodeURIComponent(String(input.distance))}&trainingType=${encodeURIComponent(input.trainingType)}${prefs ? `&${prefs}` : ""}&kind=${encodeURIComponent(route.kind)}`
  );
}

export function RouteGeneratorClient({
  initialInput,
  initialRoutes,
  initialProvider,
  initialRequestId,
  initialCandidateCount,
  activeProfile,
}: Props) {
  const actionPath = withBasePath("/");

  return (
    <main className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Panel className="overflow-hidden p-0">
        <div className="border-b border-emerald-100 bg-[linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,182,212,0.06))] px-6 py-6 md:px-7">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Plano do treino</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-emerald-950 md:text-5xl">Monte a melhor rota para hoje</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-800">
            Escolha o local, o objetivo do treino e o contexto desejado. O Ironfit retorna 3 rotas pensadas para performance, segurança e aderência ao treino.
          </p>
        </div>

        <form method="GET" action={actionPath} className="grid gap-5 px-6 py-6 md:px-7">
          <CurrentLocationField defaultValue={initialInput.location} />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Data</label>
              <input name="date" type="date" defaultValue={initialInput.date} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Horário</label>
              <input name="time" type="time" defaultValue={initialInput.time} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Modalidade</label>
              <select name="modality" defaultValue={initialInput.modality} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950">
                <option value="corrida">Corrida</option>
                <option value="bike">Bike</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Distância</label>
              <input name="distance" type="number" step="0.1" min="1" defaultValue={initialInput.distance} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Tipo de treino</label>
            <select name="trainingType" defaultValue={initialInput.trainingType} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950">
              {trainingOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Preferências</label>
              <div className="text-xs text-emerald-700">Marque o estilo de rota desejado</div>
            </div>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {preferenceOptions.map((item) => {
                const checked = initialInput.preferences.includes(item);
                return (
                  <label key={item} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 transition hover:border-emerald-200 hover:bg-emerald-50">
                    <input type="checkbox" name="preferences" value={item} defaultChecked={checked} className="size-4 accent-emerald-500" />
                    {item}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-emerald-700">Provider: <strong className="text-emerald-950">{initialProvider}</strong> · Candidatas reais: <strong className="text-emerald-950">{initialCandidateCount}</strong></div>
            <button className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
              Gerar 3 rotas recomendadas
            </button>
          </div>
        </form>
      </Panel>

      <section className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-5">
          <Panel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Local atual</div>
            <div className="mt-3 text-lg font-semibold text-emerald-950">{initialInput.location}</div>
            <div className="mt-2 text-sm text-emerald-800">{initialInput.date} · {initialInput.time}</div>
          </Panel>
          <Panel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Treino</div>
            <div className="mt-3 text-sm font-semibold text-emerald-950">{initialInput.modality} · {initialInput.distance} km</div>
            <div className="mt-2 text-sm text-emerald-800">Objetivo: {initialInput.trainingType}</div>
          </Panel>
          <Panel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Preferências</div>
            <div className="mt-3 text-sm leading-6 text-emerald-800">{initialInput.preferences.length ? initialInput.preferences.join(" • ") : "nenhuma"}</div>
          </Panel>
          <Panel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Request</div>
            <div className="mt-3 text-xs leading-6 text-emerald-800">ID: {initialRequestId}</div>
            <div className="mt-2 text-sm text-emerald-800">Google Maps ativo com candidatas reais.</div>
          </Panel>
        </div>

        {initialRoutes.map((route) => {
          const theme = kindTheme(route.kind);
          return (
            <Panel key={route.id} className={`${theme.border} ${theme.ring}`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${theme.badge}`}>{route.kind}</div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-emerald-950">{route.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-800">{route.recommendationReason}</p>
                </div>
                <div className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-950">Score {route.overallScore}</div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-5">
                {[
                  ["Distância", `${route.distanceKm} km`],
                  ["Tempo", `${route.estimatedMinutes} min`],
                  ["Elevação", `${route.elevationGain} m`],
                  ["Segurança", `${route.safetyScore}`],
                  ["Aderência", `${route.trainingFitScore}`],
                ].map(([label, value]) => (
                  <div key={label} className={`rounded-2xl border px-4 py-4 ${theme.chip}`}>
                    <div className="text-[11px] uppercase">{label}</div>
                    <div className="mt-2 text-xl font-semibold text-emerald-950">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <RouteMapCard
                  title={route.title}
                  summary={route.mapSummary}
                  polyline={route.polyline}
                  locationLabel={initialInput.location}
                  distanceKm={route.distanceKm}
                  estimatedMinutes={route.estimatedMinutes}
                />
                <div className="grid gap-4">
                  <div className={`rounded-[28px] border p-5 ${theme.chip}`}>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em]">Pontos de atenção</div>
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
                    <Link href={detailHref(route, initialInput)} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">Ver detalhe</Link>
                    <Link href={withBasePath("/historico")} className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50">Salvar / histórico</Link>
                  </div>
                </div>
              </div>
            </Panel>
          );
        })}
      </section>
    </main>
  );
}
