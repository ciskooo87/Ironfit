"use server";

import { redirect } from "next/navigation";
import { loginUser, logoutUser } from "@/lib/auth";
import { BASE_PATH } from "@/lib/base-path";

const HOME_PATH = `${BASE_PATH || ""}/`;
const LOGIN_PATH = `${BASE_PATH || ""}/login`;

export async function loginAction(formData: FormData) {
  const result = await loginUser(formData);
  if (!result.ok) return;
  redirect(HOME_PATH);
}

export async function logoutAction() {
  await logoutUser();
  redirect(LOGIN_PATH);
}
