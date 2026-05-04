import { AppShell } from "@/components/AppShell";

const preferences = [
  "Segurança acima de tudo",
  "Prefiro ciclovia ou vias mais previsíveis",
  "Gosto de parque e rota mais agradável",
  "Busco performance e menos paradas",
  "Quero evitar subida",
  "Quero usar subida como estímulo",
];

export default function OnboardingPage() {
  return (
    <AppShell>
      <main className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Onboarding</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white">Entender o atleta antes de sugerir rota</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            No MVP, essa tela coleta nível, modalidade principal e preferências padrão para personalizar a recomendação futura.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
          <form className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Nível</label>
                <select className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100">
                  <option>Iniciante</option>
                  <option>Intermediário</option>
                  <option>Avançado</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Modalidade principal</label>
                <select className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100">
                  <option>Corrida</option>
                  <option>Bike</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Preferências padrão</label>
              <div className="grid gap-2 md:grid-cols-2">
                {preferences.map((item) => (
                  <label key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200">
                    <input type="checkbox" className="size-4" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-cyan-400/30 bg-slate-900 px-4 py-4 text-sm leading-7 text-slate-300">
              Neste bloco, o próximo passo é persistir o perfil do usuário e conectar com autenticação real.
            </div>
          </form>
        </section>
      </main>
    </AppShell>
  );
}
