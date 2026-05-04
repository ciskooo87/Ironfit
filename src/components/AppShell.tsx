import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Gerar rota" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/historico", label: "Histórico" },
  { href: "/manual", label: "Manual" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 xl:px-10">
        <header className="mb-6 rounded-3xl border border-white/10 bg-white/5 px-5 py-5 backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">RouteFit AI</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Rotas melhores para corrida e bike, com contexto real</div>
              <div className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                O app recomenda a melhor rota com base em local, horário, modalidade, distância, objetivo do treino e segurança.
              </div>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm font-semibold text-slate-200">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
