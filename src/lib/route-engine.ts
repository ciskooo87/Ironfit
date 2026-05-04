import { fetchGoogleRouteCandidates, geocodeLocation, hasGoogleMapsConfigured } from "@/lib/google-maps";
import { generateRecommendations, RouteInput } from "@/lib/routefit-data";

export async function recommendRoutes(input: RouteInput) {
  const mapsEnabled = hasGoogleMapsConfigured();
  const origin = mapsEnabled ? await geocodeLocation(input.location) : null;
  const googleCandidates = origin ? await fetchGoogleRouteCandidates(origin, input.distance, input.modality) : [];

  const recommendations = generateRecommendations(input);

  return {
    provider: googleCandidates.length ? "google_maps" : mapsEnabled ? "google_maps_fallback" : "mock_rules",
    mapsEnabled,
    origin,
    recommendations,
  };
}
