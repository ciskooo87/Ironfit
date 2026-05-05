import { cookies } from "next/headers";
import type { Modality, TrainingType } from "@/lib/routefit-data";

const COOKIE_NAME = "ironfit_profile";

export type IronfitProfile = {
  level: "Iniciante" | "Intermediário" | "Avançado";
  modality: Modality;
  trainingType: TrainingType;
  preferences: string[];
};

const DEFAULT_PROFILE: IronfitProfile = {
  level: "Intermediário",
  modality: "corrida",
  trainingType: "leve",
  preferences: ["evitar trânsito", "rota circular"],
};

export async function getIronfitProfile(): Promise<IronfitProfile> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return DEFAULT_PROFILE;
  try {
    const parsed = JSON.parse(raw) as Partial<IronfitProfile>;
    return {
      level: parsed.level ?? DEFAULT_PROFILE.level,
      modality: parsed.modality === "bike" ? "bike" : DEFAULT_PROFILE.modality,
      trainingType: parsed.trainingType ?? DEFAULT_PROFILE.trainingType,
      preferences: Array.isArray(parsed.preferences) && parsed.preferences.length ? parsed.preferences.map(String) : DEFAULT_PROFILE.preferences,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function saveIronfitProfile(formData: FormData) {
  const store = await cookies();
  const level = String(formData.get("level") || DEFAULT_PROFILE.level) as IronfitProfile["level"];
  const modality = String(formData.get("modality") || DEFAULT_PROFILE.modality) === "bike" ? "bike" : "corrida";
  const trainingType = String(formData.get("trainingType") || DEFAULT_PROFILE.trainingType) as TrainingType;
  const preferences = formData.getAll("preferences").map((item) => String(item)).filter(Boolean);

  const payload: IronfitProfile = {
    level,
    modality,
    trainingType,
    preferences: preferences.length ? preferences : DEFAULT_PROFILE.preferences,
  };

  store.set(COOKIE_NAME, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return payload;
}
