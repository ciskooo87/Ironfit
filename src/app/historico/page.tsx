import { AppShell } from "@/components/AppShell";
import { getMockHistory } from "@/lib/routefit-data";

export default function HistoryPage() {
  const items = getMockHistory();

  return (
    <AppShell>
      <main className="grid gap-6">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Histórico</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white">Rotas salvas e recomendações anteriores</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">No MVP real, esta tela vai puxar rotas salvas por usuário autenticado.</p>
        </section>

        <section className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.date}</div>
              <div className="mt-2 text-2xl font-semibold text-white">{item.title}</div>
              <div className="mt-3 text-sm text-slate-300">{item.summary}</div>
            </article>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
