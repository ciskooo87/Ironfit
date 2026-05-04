import { randomUUID } from "crypto";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getDb, hasDatabaseConfigured } from "@/lib/db";
import { RouteInput, RouteRecommendation } from "@/lib/routefit-data";

const STORAGE_DIR = path.join(process.cwd(), ".data");

export type StoredRouteRequest = {
  id: string;
  input: RouteInput;
  recommendations: RouteRecommendation[];
  createdAt: string;
  storage: "file" | "database";
};

async function saveToFile(input: RouteInput, recommendations: RouteRecommendation[]) {
  await mkdir(STORAGE_DIR, { recursive: true });
  const id = randomUUID();
  const payload: StoredRouteRequest = {
    id,
    input,
    recommendations,
    createdAt: new Date().toISOString(),
    storage: "file",
  };
  await writeFile(path.join(STORAGE_DIR, `${id}.json`), JSON.stringify(payload, null, 2), "utf8");
  return id;
}

async function listFromFile(): Promise<StoredRouteRequest[]> {
  await mkdir(STORAGE_DIR, { recursive: true });
  const files = (await readdir(STORAGE_DIR)).filter((file) => file.endsWith(".json"));
  const items = await Promise.all(
    files.map(async (file) => {
      try {
        const raw = await readFile(path.join(STORAGE_DIR, file), "utf8");
        return JSON.parse(raw) as StoredRouteRequest;
      } catch {
        return null;
      }
    })
  );

  return items
    .filter((item): item is StoredRouteRequest => item !== null)
    .map((item) => ({ ...item, storage: item.storage ?? "file" }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function ensureUser(email: string) {
  const db = getDb();
  if (!db) return null;
  const existing = await db.query(`select id from users where email = $1 limit 1`, [email]);
  if (existing.rows[0]?.id) return existing.rows[0].id as string;

  const id = randomUUID();
  const name = email.split("@")[0] || "Atleta";
  await db.query(`insert into users (id, email, name) values ($1,$2,$3)`, [id, email, name]);
  return id;
}

async function saveToDb(input: RouteInput, recommendations: RouteRecommendation[], userEmail?: string | null) {
  const db = getDb();
  if (!db) return saveToFile(input, recommendations);

  const id = randomUUID();
  const userId = userEmail ? await ensureUser(userEmail) : null;

  await db.query(
    `insert into route_requests (id, user_id, location_label, scheduled_date, scheduled_time, modality, distance_km, training_type, preferences_json)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)`,
    [id, userId, input.location, input.date, input.time, input.modality, input.distance, input.trainingType, JSON.stringify(input.preferences)]
  );

  for (const route of recommendations) {
    await db.query(
      `insert into saved_routes (
        id, request_id, route_kind, title, distance_km, estimated_minutes, elevation_gain, overall_score,
        safety_score, training_fit_score, traffic_score, elevation_score, flow_score, popularity_score,
        recommendation_reason, attention_points_json, polyline, route_geometry, provider
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb,$17,
        case when $17::text is not null then ST_LineFromEncodedPolyline($17::text) else null end,
        $18
      )`,
      [
        route.id,
        id,
        route.kind,
        route.title,
        route.distanceKm,
        route.estimatedMinutes,
        route.elevationGain,
        route.overallScore,
        route.safetyScore,
        route.trainingFitScore,
        route.trafficScore,
        route.elevationScore,
        route.flowScore,
        route.popularityScore,
        route.recommendationReason,
        JSON.stringify(route.attentionPoints),
        route.polyline ?? null,
        "google_maps",
      ]
    );
  }

  return id;
}

async function listFromDb(): Promise<StoredRouteRequest[]> {
  const db = getDb();
  if (!db) return listFromFile();

  const { rows } = await db.query(`
    select rr.id,
           rr.location_label,
           rr.scheduled_date::text,
           rr.scheduled_time::text,
           rr.modality,
           rr.distance_km,
           rr.training_type,
           rr.preferences_json,
           rr.created_at,
           json_agg(json_build_object(
             'id', sr.id,
             'kind', sr.route_kind,
             'title', sr.title,
             'distanceKm', sr.distance_km,
             'estimatedMinutes', sr.estimated_minutes,
             'elevationGain', sr.elevation_gain,
             'overallScore', sr.overall_score,
             'safetyScore', sr.safety_score,
             'trainingFitScore', sr.training_fit_score,
             'trafficScore', sr.traffic_score,
             'elevationScore', sr.elevation_score,
             'flowScore', sr.flow_score,
             'popularityScore', sr.popularity_score,
             'attentionPoints', sr.attention_points_json,
             'recommendationReason', sr.recommendation_reason,
             'mapSummary', sr.title,
             'polyline', sr.polyline,
             'geometryAvailable', (sr.route_geometry is not null)
           ) order by sr.overall_score desc) as recommendations
    from route_requests rr
    join saved_routes sr on sr.request_id = rr.id
    group by rr.id
    order by rr.created_at desc
    limit 50
  `);

  return rows.map((row) => ({
    id: row.id,
    storage: "database" as const,
    input: {
      location: row.location_label,
      date: row.scheduled_date,
      time: String(row.scheduled_time).slice(0, 5),
      modality: row.modality,
      distance: Number(row.distance_km),
      trainingType: row.training_type,
      preferences: Array.isArray(row.preferences_json) ? row.preferences_json : [],
    },
    recommendations: Array.isArray(row.recommendations) ? row.recommendations : [],
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  }));
}

export async function saveRouteRequest(input: RouteInput, recommendations: RouteRecommendation[], userEmail?: string | null) {
  if (hasDatabaseConfigured()) return saveToDb(input, recommendations, userEmail);
  return saveToFile(input, recommendations);
}

export async function listSavedRouteRequests(): Promise<StoredRouteRequest[]> {
  if (hasDatabaseConfigured()) return listFromDb();
  return listFromFile();
}
