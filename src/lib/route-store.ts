import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { RouteInput, RouteRecommendation } from "@/lib/routefit-data";

const STORAGE_DIR = path.join(process.cwd(), ".data");

export async function saveRouteRequest(input: RouteInput, recommendations: RouteRecommendation[]) {
  await mkdir(STORAGE_DIR, { recursive: true });
  const id = randomUUID();
  const payload = {
    id,
    input,
    recommendations,
    createdAt: new Date().toISOString(),
  };
  await writeFile(path.join(STORAGE_DIR, `${id}.json`), JSON.stringify(payload, null, 2), "utf8");
  return id;
}
