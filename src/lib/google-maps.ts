export type LatLng = { lat: number; lng: number };

export type MapsRouteCandidate = {
  id: string;
  summary: string;
  distanceMeters: number;
  durationSeconds: number;
  polyline?: string;
  warnings?: string[];
};

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
  if (!location?.lat || !location?.lng) return null;
  return { lat: location.lat, lng: location.lng };
}

export async function fetchGoogleRouteCandidates(_origin: LatLng, _distanceKm: number, _mode: "corrida" | "bike") {
  return [] as MapsRouteCandidate[];
}

export function hasGoogleMapsConfigured() {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY);
}
