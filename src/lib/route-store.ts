import { randomUUID } from "crypto";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { RouteInput, RouteRecommendation } from "@/lib/routefit-data";

const STORAGE_DIR = path.join(process.cwd(), ".data");

export type StoredRouteRequest = {
  id: string;
  input: RouteInput;
  recommendations: RouteRecommendation[];
  createdAt: string;
};

export async function saveRouteRequest(input: RouteInput, recommendations: RouteRecommendation[]) {
  await mkdir(STORAGE_DIR, { recursive: true });
  const id = randomUUID();
  const payload: StoredRouteRequest = {
    id,
    input,
    recommendations,
    createdAt: new Date().toISOString(),
  };
  await writeFile(path.join(STORAGE_DIR, `${id}.json`), JSON.stringify(payload, null, 2), "utf8");
  return id;
}

export async function listSavedRouteRequests(): Promise<StoredRouteRequest[]> {
  await mkdir(STORAGE_DIR, { recursive: true });
  const files = (await readdir(STORAGE_DIR)).filter((file) => file.endsWith('.json'));
  const items = await Promise.all(
    files.map(async (file) => {
      try {
        const raw = await readFile(path.join(STORAGE_DIR, file), 'utf8');
        return JSON.parse(raw) as StoredRouteRequest;
      } catch {
        return null;
      }
    })
  );

  return items
    .filter((item): item is StoredRouteRequest => item !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
