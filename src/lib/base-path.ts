export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(pathname: string) {
  if (!BASE_PATH) return pathname;
  if (pathname.startsWith(BASE_PATH)) return pathname;
  return `${BASE_PATH}${pathname}`;
}
