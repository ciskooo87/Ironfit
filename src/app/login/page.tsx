import { AppShell } from "@/components/AppShell";
import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Login MVP</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white">Entrar no Ironfit</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">Login simples por cookie para destravar o fluxo inicial de usuário sem overengineering.</p>

        <form action={loginAction} className="mt-6 grid gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Nome</label>
            <input name="name" placeholder="Ex.: Paulo" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Email</label>
            <input name="email" type="email" placeholder="voce@exemplo.com" className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100" />
          </div>
          <button className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">Entrar</button>
        </form>
      </main>
    </AppShell>
  );
}
