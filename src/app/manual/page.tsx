import { AppShell } from "@/components/AppShell";

const sections = [
  {
    title: "Objetivo do app",
    items: [
      "Recomendar a melhor rota possível, e não desenhar a navegação completa no primeiro momento.",
      "Levar em conta local, horário, modalidade, distância, treino e preferências do usuário.",
      "Entregar 3 leituras claras: melhor geral, performance e mais segura.",
    ],
  },
  {
    title: "Fluxo do MVP",
    items: [
      "Onboarding para capturar nível e preferências padrão.",
      "Formulário de treino na home com contexto do treino do dia.",
      "Geração de 3 rotas candidatas com score simples por regras.",
      "Tela de detalhe mostrando justificativa, score e pontos de atenção.",
      "Histórico de rotas salvas como etapa seguinte do produto.",
    ],
  },
  {
    title: "Próximas integrações",
    items: [
      "Google Maps API no MVP real: rotas, trânsito real e padrão por horário.",
      "PostgreSQL + PostGIS para persistência e geodados.",
      "Login real + salvar rotas por usuário.",
      "Strava na fase 2 para popularidade e segmentos.",
    ],
  },
  {
    title: "Decisões de produto",
    items: [
      "Evitar overengineering no começo.",
      "Score inicialmente híbrido, baseado em regras simples e explicação textual clara.",
      "Primeiro deploy útil antes de refinamento profundo de IA e geoespacial.",
    ],
  },
];

export default function ManualPage() {
  return (
    <AppShell>
      <main className="grid gap-6">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Manual</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white">Como operar o MVP do RouteFit AI</h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
            Este manual resume o escopo do MVP, o fluxo do usuário e as próximas integrações necessárias para sair do protótipo funcional e entrar em operação real.
          </p>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="rounded-[30px] border border-white/10 bg-white/5 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Guia operacional</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{section.title}</h2>
              <div className="mt-5 grid gap-3">
                {section.items.map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-900 px-4 py-4 text-sm leading-7 text-slate-300">{item}</div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
