import { AppShell } from "@/components/AppShell";
import { preferenceOptions, trainingOptions } from "@/lib/routefit-data";
import { getIronfitProfile } from "@/lib/profile";
import { saveOnboardingAction } from "./actions";

const levels = ["Iniciante", "Intermediário", "Avançado"] as const;

export default async function OnboardingPage() {
  const profile = await getIronfitProfile();

  return (
    <AppShell>
      <main className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.06)] md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Onboarding</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-emerald-950">Entender o atleta antes de sugerir rota</h1>
          <p className="mt-4 text-sm leading-7 text-emerald-800">
            Agora esta tela já salva um perfil base do atleta e usa isso como ponto de partida na home do Ironfit.
          </p>
          <div className="mt-5 rounded-[24px] border border-emerald-100 bg-emerald-50/60 px-4 py-4 text-sm leading-7 text-emerald-900">
            O que você salvar aqui vira default de modalidade, tipo de treino e preferências na próxima geração de rotas.
          </div>
        </section>

        <section className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.06)] md:p-8">
          <form action={saveOnboardingAction} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Nível</label>
                <select name="level" defaultValue={profile.level} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950">
                  {levels.map((level) => <option key={level}>{level}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Modalidade principal</label>
                <select name="modality" defaultValue={profile.modality} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950">
                  <option value="corrida">Corrida</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Tipo de treino padrão</label>
              <select name="trainingType" defaultValue={profile.trainingType} className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950">
                {trainingOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Preferências padrão</label>
                <div className="text-xs text-emerald-700">Essas preferências entram como default na home</div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {preferenceOptions.map((item) => (
                  <label key={item} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 transition hover:bg-emerald-50">
                    <input type="checkbox" name="preferences" value={item} defaultChecked={profile.preferences.includes(item)} className="size-4 accent-emerald-500" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-emerald-800">Perfil atual: <strong className="text-emerald-950">{profile.modality}</strong> · <strong className="text-emerald-950">{profile.trainingType}</strong></div>
              <button className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">Salvar onboarding</button>
            </div>
          </form>
        </section>
      </main>
    </AppShell>
  );
}
