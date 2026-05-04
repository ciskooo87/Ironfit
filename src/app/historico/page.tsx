import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { listSavedRouteRequests } from "@/lib/route-store";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  const items = await listSavedRouteRequests(user?.email ?? null);

  return (
    <AppShell>
      <main className="grid gap-6">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Histórico</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white">Rotas geradas e recomendações salvas</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">O histórico agora tenta respeitar o usuário logado. Quando houver banco ativo, cada atleta vê primeiro as rotas associadas à sua própria sessão.</p>
        </section>

        <section className="grid gap-4">
          {items.length ? items.map((item) => {
            const best = item.recommendations[0];
            return (
              <article key={item.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{new Date(item.createdAt).toLocaleString("pt-BR")}</div>
                <div className="mt-2 text-2xl font-semibold text-white">{item.input.modality} · {item.input.location}</div>
                <div className="mt-3 text-sm text-slate-300">{item.input.distance} km · {item.input.trainingType} · {item.input.date} {item.input.time}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">Origem: {item.storage === "database" ? "PostgreSQL" : "arquivo local"}</div>
                <div className="mt-3 rounded-2xl bg-slate-900 px-4 py-4 text-sm leading-7 text-slate-300">
                  Melhor rota atual: <strong className="text-white">{best?.kind ?? "-"}</strong> · score <strong className="text-white">{best?.overallScore ?? "-"}</strong>
                  <div className="mt-2 text-xs text-slate-400">Geometria: {best?.geometryAvailable ? "disponível no banco" : "não disponível"}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.recommendations.map((route) => (
                    <Link key={route.id} href={`/rotas/${route.id}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100">
                      {route.kind}
                    </Link>
                  ))}
                </div>
              </article>
            );
          }) : (
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
              {user ? "Nenhuma rota salva ainda para este usuário. Gere uma recomendação na home para começar o histórico." : "Faça login para ter um histórico vinculado ao seu usuário. Sem login, o MVP pode cair em histórico local compartilhado do ambiente."}
            </article>
          )}
        </section>
      </main>
    </AppShell>
  );
}
