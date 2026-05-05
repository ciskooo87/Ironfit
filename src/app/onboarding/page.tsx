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
        <section className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.06)] md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Onboarding</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-emerald-950">Entender o atleta antes de sugerir rota</h1>
          <p className="mt-4 text-sm leading-7 text-emerald-800">
            Nesta etapa o Ironfit prepara o perfil base do atleta para sugerir rotas mais alinhadas com nível, objetivo e preferências recorrentes.
          </p>
          <div className="mt-5 rounded-[24px] border border-emerald-100 bg-emerald-50/60 px-4 py-4 text-sm leading-7 text-emerald-900">
            No estágio atual do produto, esta tela ainda funciona como definição visual de perfil. O próximo passo é persistir isso por usuário autenticado.
          </div>
        </section>

        <section className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.06)] md:p-8">
          <form className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Nível</label>
                <select className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950">
                  <option>Iniciante</option>
                  <option>Intermediário</option>
                  <option>Avançado</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Modalidade principal</label>
                <select className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950">
                  <option>Corrida</option>
                  <option>Bike</option>
                </select>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Preferências padrão</label>
                <div className="text-xs text-emerald-700">Essas preferências devem influenciar a home no futuro</div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {preferences.map((item) => (
                  <label key={item} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 transition hover:bg-emerald-50">
                    <input type="checkbox" className="size-4 accent-emerald-500" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-emerald-200 bg-white px-4 py-4 text-sm leading-7 text-emerald-800">
              Próximo passo do produto: persistir o perfil do usuário, conectar com autenticação real e usar esse contexto como default na geração das rotas.
            </div>
          </form>
        </section>
      </main>
    </AppShell>
  );
}
