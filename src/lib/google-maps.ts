export type LatLng = { lat: number; lng: number };

export type MapsRouteCandidate = {
  id: string;
  summary: string;
  distanceMeters: number;
  durationSeconds: number;
  polyline?: string;
  warnings?: string[];
  waypointLabel: string;
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function offsetPoint(origin: LatLng, distanceKm: number, bearingDegrees: number): LatLng {
  const earthRadiusKm = 6371;
  const angularDistance = distanceKm / earthRadiusKm;
  const bearing = toRadians(bearingDegrees);
  const lat1 = toRadians(origin.lat);
  const lng1 = toRadians(origin.lng);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
  );

  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    lat: toDegrees(lat2),
    lng: toDegrees(lng2),
  };
}

function buildWaypointCandidates(origin: LatLng, distanceKm: number) {
  const factors = [0.28, 0.34, 0.4];
  const bearings = [0, 45, 90, 135, 180, 225];
  const candidates: Array<{ id: string; label: string; point: LatLng }> = [];

  for (const factor of factors) {
    for (const bearing of bearings) {
      const distance = Math.max(1.2, distanceKm * factor);
      candidates.push({
        id: `b${bearing}-f${String(factor).replace('.', '')}`,
        label: `Loop ${bearing}° · fator ${factor}`,
        point: offsetPoint(origin, distance, bearing),
      });
    }
  }

  return candidates;
}

export async function geocodeLocation(input: string): Promise<LatLng | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || !input.trim()) return null;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(input)}&key=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    results?: Array<{ geometry?: { location?: { lat?: number; lng?: number } } }>;
  };

  const location = data.results?.[0]?.geometry?.location;
  if (location?.lat == null || location?.lng == null) return null;
  return { lat: location.lat, lng: location.lng };
}

async function fetchDirectionsRoute(origin: LatLng, waypoint: LatLng, mode: "corrida" | "bike", apiKey: string) {
  const travelMode = mode === "bike" ? "bicycling" : "walking";
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${origin.lat},${origin.lng}&waypoints=${waypoint.lat},${waypoint.lng}&mode=${travelMode}&departure_time=now&alternatives=false&key=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    routes?: Array<{
      summary?: string;
      overview_polyline?: { points?: string };
      warnings?: string[];
      legs?: Array<{ distance?: { value?: number }; duration?: { value?: number } }>;
    }>;
  };

  const route = data.routes?.[0];
  if (!route?.legs?.length) return null;

  const distanceMeters = route.legs.reduce((sum, leg) => sum + Number(leg.distance?.value || 0), 0);
  const durationSeconds = route.legs.reduce((sum, leg) => sum + Number(leg.duration?.value || 0), 0);

  return {
    summary: route.summary || "Rota candidata",
    distanceMeters,
    durationSeconds,
    polyline: route.overview_polyline?.points,
    warnings: route.warnings || [],
  };
}

export async function fetchGoogleRouteCandidates(origin: LatLng, distanceKm: number, mode: "corrida" | "bike") {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return [] as MapsRouteCandidate[];

  const waypointCandidates = buildWaypointCandidates(origin, distanceKm);
  const results: Array<MapsRouteCandidate | null> = await Promise.all(
    waypointCandidates.map(async (candidate) => {
      const route = await fetchDirectionsRoute(origin, candidate.point, mode, apiKey);
      if (!route) return null;
      return {
        id: candidate.id,
        summary: route.summary,
        distanceMeters: route.distanceMeters,
        durationSeconds: route.durationSeconds,
        polyline: route.polyline,
        warnings: route.warnings,
        waypointLabel: candidate.label,
      } satisfies MapsRouteCandidate;
    })
  );

  return results
    .filter((item): item is MapsRouteCandidate => item !== null)
    .sort((a, b) => a.durationSeconds - b.durationSeconds)
    .slice(0, 6);
}

export function hasGoogleMapsConfigured() {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY);
}
