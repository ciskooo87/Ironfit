import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { withBasePath } from "@/lib/base-path";
import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <AppShell>
      <main className="mx-auto grid max-w-5xl gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.06)] md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Login MVP</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-emerald-950">Entrar no Ironfit</h1>
          <p className="mt-4 text-sm leading-7 text-emerald-800">
            Login simples por cookie para liberar histórico, personalização básica e futuras preferências por atleta sem complicar o MVP agora.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              "Associar histórico ao atleta logado",
              "Preparar preferências padrão por usuário",
              "Destravar evolução futura com perfil persistido",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-4 text-sm text-emerald-900">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.06)] md:p-8">
          <form action={loginAction} className="grid gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Nome</label>
              <input name="name" placeholder="Ex.: Paulo" className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Email</label>
              <input name="email" type="email" placeholder="voce@exemplo.com" className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950" />
            </div>
            <button className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">Entrar</button>
          </form>

          <div className="mt-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-4 text-sm leading-7 text-emerald-800">
            Esse login ainda é propositalmente leve. O foco agora é manter a experiência funcional, rápida e conectada ao histórico certo.
          </div>

          <div className="mt-5">
            <Link href={withBasePath("/")} className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">
              ← Voltar para gerar rota
            </Link>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
