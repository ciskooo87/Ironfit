import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { withBasePath } from "@/lib/base-path";
import { getCurrentUser } from "@/lib/auth";
import { listSavedRouteRequests } from "@/lib/route-store";

function detailHref(routeId: string, item: Awaited<ReturnType<typeof listSavedRouteRequests>>[number], kind?: string) {
  const prefs = item.input.preferences.map((pref) => `preferences=${encodeURIComponent(pref)}`).join("&");
  return withBasePath(
    `/rotas/${routeId}?location=${encodeURIComponent(item.input.location)}&date=${encodeURIComponent(item.input.date)}&time=${encodeURIComponent(item.input.time)}&modality=${encodeURIComponent(item.input.modality)}&distance=${encodeURIComponent(String(item.input.distance))}&trainingType=${encodeURIComponent(item.input.trainingType)}${prefs ? `&${prefs}` : ""}${kind ? `&kind=${encodeURIComponent(kind)}` : ""}`
  );
}

export default async function HistoryPage() {
  const user = await getCurrentUser();
  const items = await listSavedRouteRequests(user?.email ?? null);

  return (
    <AppShell>
      <main className="grid gap-6">
        <section className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.06)] md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Histórico</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-emerald-950">Rotas geradas e recomendações salvas</h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-emerald-800">
            Aqui ficam os treinos e combinações de rota que já passaram pelo motor do Ironfit. Use o histórico para revisar decisões, comparar leituras e abrir os detalhes de cada contexto.
          </p>
        </section>

        <section className="grid gap-4">
          {items.length ? (
            items.map((item) => {
              const best = item.recommendations[0];
              return (
                <article key={item.id} className="rounded-[30px] border border-emerald-100 bg-white p-5 shadow-[0_16px_50px_rgba(16,24,40,0.06)]">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">{new Date(item.createdAt).toLocaleString("pt-BR")}</div>
                      <div className="mt-2 text-2xl font-semibold text-emerald-950">{item.input.modality} · {item.input.location}</div>
                      <div className="mt-3 text-sm text-emerald-800">{item.input.distance} km · {item.input.trainingType} · {item.input.date} {item.input.time}</div>
                    </div>
                    <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                      Origem: {item.storage === "database" ? "PostgreSQL" : "arquivo local"}
                    </div>
                  </div>

                  <div className="mt-4 rounded-[24px] border border-emerald-100 bg-emerald-50/60 px-4 py-4 text-sm leading-7 text-emerald-900">
                    <div>Melhor rota atual: <strong className="text-emerald-950">{best?.kind ?? "-"}</strong> · score <strong className="text-emerald-950">{best?.overallScore ?? "-"}</strong></div>
                    <div className="mt-3 grid gap-2 md:grid-cols-3">
                      <div className="rounded-xl border border-emerald-100 bg-white px-3 py-3">Segurança <strong className="ml-1 text-emerald-950">{best?.safetyScore ?? "-"}</strong></div>
                      <div className="rounded-xl border border-emerald-100 bg-white px-3 py-3">Aderência <strong className="ml-1 text-emerald-950">{best?.trainingFitScore ?? "-"}</strong></div>
                      <div className="rounded-xl border border-emerald-100 bg-white px-3 py-3">Fluidez <strong className="ml-1 text-emerald-950">{best?.flowScore ?? "-"}</strong></div>
                    </div>
                    <div className="mt-3 text-xs text-emerald-700">Geometria: {best?.geometryAvailable ? "disponível no banco" : "não disponível"}</div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.recommendations.map((route) => (
                      <Link key={route.id} href={detailHref(route.id, item, route.kind)} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50">
                        {route.kind}
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })
          ) : (
            <article className="rounded-[30px] border border-dashed border-emerald-200 bg-white p-8 text-center shadow-[0_16px_50px_rgba(16,24,40,0.04)]">
              <div className="text-sm leading-7 text-emerald-800">
                {user
                  ? "Nenhuma rota salva ainda para este usuário. Gere uma recomendação na home para começar o histórico."
                  : "Faça login para ter um histórico vinculado ao seu usuário. Sem login, o MVP pode cair em histórico local compartilhado do ambiente."}
              </div>
              <div className="mt-5">
                <Link href={withBasePath("/")} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
                  Gerar primeira rota
                </Link>
              </div>
            </article>
          )}
        </section>
      </main>
    </AppShell>
  );
}
