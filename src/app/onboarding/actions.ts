"use server";

import { redirect } from "next/navigation";
import { BASE_PATH } from "@/lib/base-path";
import { saveIronfitProfile } from "@/lib/profile";

export async function saveOnboardingAction(formData: FormData) {
  await saveIronfitProfile(formData);
  redirect(`${BASE_PATH || ""}/?profileSaved=1`);
}
