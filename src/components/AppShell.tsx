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
    <div className="min-h-screen text-emerald-950">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 xl:px-10">
        <header className="mb-6 overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-[0_20px_70px_rgba(16,24,40,0.08)]">
          <div className="bg-gradient-to-r from-emerald-500 via-lime-400 to-cyan-400 px-6 py-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/80">Ironfit · RouteFit AI</div>
            <div className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Treine melhor com rotas pensadas para performance e segurança</div>
            <div className="mt-2 max-w-3xl text-sm leading-7 text-white/90">
              O app recomenda a melhor rota com base em local, horário, modalidade, distância, objetivo do treino e contexto real.
            </div>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
            <nav className="flex flex-wrap gap-2 text-sm font-semibold text-emerald-900">
              {navItems.map((item) => (
                <Link key={item.href} href={withBasePath(item.href)} className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 transition hover:bg-emerald-100">
                  {item.label}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="flex flex-col gap-3 xl:items-end">
                <div className="text-sm text-emerald-800">
                  Conectado como <strong className="text-emerald-950">{user.name}</strong>
                </div>
                <form action={logoutAction}>
                  <button className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900">Sair</button>
                </form>
              </div>
            ) : (
              <div className="text-sm text-emerald-700">Sem login ativo</div>
            )}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
