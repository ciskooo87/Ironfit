import Link from "next/link";
import { ReactNode } from "react";
import { logoutAction } from "@/app/login/actions";
import { getCurrentUser } from "@/lib/auth";
import { withBasePath } from "@/lib/base-path";

const navItems = [
  { href: "/", label: "Gerar rota" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/historico", label: "Histórico" },
  { href: "/manual", label: "Manual" },
  { href: "/login", label: "Login" },
];

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_28%),linear-gradient(180deg,#f7fbf7_0%,#edf7ef_42%,#f5f8f4_100%)] text-emerald-950">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 xl:px-10">
        <header className="mb-6 overflow-hidden rounded-[36px] border border-emerald-100 bg-white shadow-[0_24px_80px_rgba(16,24,40,0.08)]">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#10b981_0%,#84cc16_50%,#06b6d4_100%)] px-6 py-6 text-white md:px-8 md:py-7">
            <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[-50px] left-[35%] h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">Ironfit · RouteFit AI</div>
              <div className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Treine melhor com rotas pensadas para performance, segurança e contexto real</div>
              <div className="mt-3 max-w-3xl text-sm leading-7 text-white/90 md:text-base">
                Escolha o local, o objetivo do treino e o estilo da rota. O Ironfit organiza as melhores opções com mapa, leitura rápida e detalhe prático para sair treinando.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5 md:px-8 xl:flex-row xl:items-center xl:justify-between">
            <nav className="flex flex-wrap gap-2 text-sm font-semibold text-emerald-900">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={withBasePath(item.href)}
                  className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 transition hover:border-emerald-200 hover:bg-emerald-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="flex flex-col gap-3 xl:items-end">
                <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                  Conectado como <strong className="text-emerald-950">{user.name}</strong>
                </div>
                <form action={logoutAction}>
                  <button className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50">
                    Sair
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Sem login ativo</div>
            )}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
