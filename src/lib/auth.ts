import { cookies } from "next/headers";

const COOKIE_NAME = "ironfit_user";

export async function getCurrentUser() {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { email: string; name: string };
  } catch {
    return null;
  }
}

export async function loginUser(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const name = String(formData.get("name") || email.split("@")[0] || "Atleta").trim();
  if (!email) return { ok: false };

  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify({ email, name }), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { ok: true };
}

export async function logoutUser() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
