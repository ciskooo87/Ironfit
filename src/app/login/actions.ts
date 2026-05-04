"use server";

import { redirect } from "next/navigation";
import { loginUser, logoutUser } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const result = await loginUser(formData);
  if (!result.ok) return;
  redirect("/");
}

export async function logoutAction() {
  await logoutUser();
  redirect("/login");
}
