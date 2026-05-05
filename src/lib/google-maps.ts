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

type WaypointCandidate = {
  id: string;
  label: string;
  pointA: LatLng;
  pointB?: LatLng;
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

function buildWaypointCandidates(origin: LatLng, distanceKm: number, prefersCircular = false): WaypointCandidate[] {
  const factors = prefersCircular ? [0.32, 0.4, 0.48] : [0.28, 0.34, 0.4];
  const bearings = [0, 45, 90, 135, 180, 225];
  const candidates: WaypointCandidate[] = [];

  for (const factor of factors) {
    for (const bearing of bearings) {
      const distance = Math.max(1.2, distanceKm * factor);
      const pointA = offsetPoint(origin, distance, bearing);
      const pointB = prefersCircular ? offsetPoint(origin, Math.max(1.1, distanceKm * (factor * 0.92)), (bearing + 70) % 360) : undefined;
      candidates.push({
        id: `b${bearing}-f${String(factor).replace('.', '')}`,
        label: `Loop ${bearing}° · fator ${factor}`,
        pointA,
        pointB,
      });
    }
  }

  return candidates;
}

export async function geocodeLocation(input: string): Promise<LatLng | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || !input.trim()) return null;

  const trimmed = input.trim();
  const coordMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (coordMatch) {
    return { lat: Number(coordMatch[1]), lng: Number(coordMatch[2]) };
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(trimmed)}&key=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    results?: Array<{ geometry?: { location?: { lat?: number; lng?: number } } }>;
  };

  const location = data.results?.[0]?.geometry?.location;
  if (location?.lat == null || location?.lng == null) return null;
  return { lat: location.lat, lng: location.lng };
}

async function fetchDirectionsRoute(origin: LatLng, candidate: WaypointCandidate, mode: "corrida" | "bike", apiKey: string) {
  const travelMode = mode === "bike" ? "bicycling" : "walking";
  const waypointParts = [candidate.pointA, candidate.pointB].filter(Boolean).map((point) => `${point!.lat},${point!.lng}`);
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${origin.lat},${origin.lng}&waypoints=${waypointParts.join('|')}&mode=${travelMode}&departure_time=now&alternatives=false&key=${apiKey}`;
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

function encodeSigned(value: number) {
  let sgnNum = value << 1;
  if (value < 0) sgnNum = ~sgnNum;
  let encoded = "";
  while (sgnNum >= 0x20) {
    encoded += String.fromCharCode((0x20 | (sgnNum & 0x1f)) + 63);
    sgnNum >>= 5;
  }
  encoded += String.fromCharCode(sgnNum + 63);
  return encoded;
}

function encodePolyline(points: LatLng[]) {
  let lastLat = 0;
  let lastLng = 0;
  let result = "";
  for (const point of points) {
    const lat = Math.round(point.lat * 1e5);
    const lng = Math.round(point.lng * 1e5);
    result += encodeSigned(lat - lastLat);
    result += encodeSigned(lng - lastLng);
    lastLat = lat;
    lastLng = lng;
  }
  return result;
}

function buildSyntheticCandidates(origin: LatLng, distanceKm: number, mode: "corrida" | "bike", prefersCircular = false) {
  return buildWaypointCandidates(origin, distanceKm, prefersCircular).slice(0, 6).map((candidate, index) => {
    const secondPoint = candidate.pointB ?? offsetPoint(origin, Math.max(0.8, distanceKm * 0.22), (index * 55 + 35) % 360);
    const points = [origin, candidate.pointA, secondPoint, origin];
    const estimatedMinutes = mode === "bike" ? Math.round(distanceKm * 2.3) : Math.round(distanceKm * 6.1);
    return {
      id: candidate.id,
      summary: `Loop estimado · ${candidate.label}`,
      distanceMeters: Math.round(distanceKm * 1000),
      durationSeconds: estimatedMinutes * 60,
      polyline: encodePolyline(points),
      warnings: [prefersCircular ? "Rota circular estimada por fallback geográfico." : "Rota estimada por fallback geográfico, sem Directions em tempo real."],
      waypointLabel: candidate.label,
    } satisfies MapsRouteCandidate;
  });
}

export async function fetchGoogleRouteCandidates(origin: LatLng, distanceKm: number, mode: "corrida" | "bike", preferences: string[] = []) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const prefersCircular = preferences.includes("rota circular");
  if (!apiKey) return buildSyntheticCandidates(origin, distanceKm, mode, prefersCircular);

  const waypointCandidates = buildWaypointCandidates(origin, distanceKm, prefersCircular);
  const results: Array<MapsRouteCandidate | null> = await Promise.all(
    waypointCandidates.map(async (candidate) => {
      const route = await fetchDirectionsRoute(origin, candidate, mode, apiKey);
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

  const filtered = results.filter((item): item is MapsRouteCandidate => item !== null).sort((a, b) => a.durationSeconds - b.durationSeconds).slice(0, 6);
  return filtered.length ? filtered : buildSyntheticCandidates(origin, distanceKm, mode, prefersCircular);
}

export function hasGoogleMapsConfigured() {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY);
}
