import { fetchGoogleRouteCandidates, geocodeLocation, hasGoogleMapsConfigured } from "@/lib/google-maps";
import { scoreCandidate } from "@/lib/route-scoring";
import { generateRecommendations, RouteInput, RouteRecommendation } from "@/lib/routefit-data";
import { saveRouteRequest } from "@/lib/route-store";

function mapCandidatesToRecommendations(candidates: Awaited<ReturnType<typeof fetchGoogleRouteCandidates>>, input: RouteInput): RouteRecommendation[] {
  if (!candidates.length) return generateRecommendations(input);

  const bestGeneral = scoreCandidate("Melhor geral", candidates[0], input);
  const performanceCandidate = candidates[1] ?? candidates[0];
  const safestCandidate = candidates[2] ?? candidates[0];

  return [
    bestGeneral,
    scoreCandidate("Performance", performanceCandidate, input),
    scoreCandidate("Mais segura", safestCandidate, input),
  ].sort((a, b) => b.overallScore - a.overallScore);
}

export async function recommendRoutes(input: RouteInput, userEmail?: string | null) {
  const mapsEnabled = hasGoogleMapsConfigured();
  const origin = mapsEnabled ? await geocodeLocation(input.location) : null;
  const googleCandidates = origin ? await fetchGoogleRouteCandidates(origin, input.distance, input.modality, input.preferences) : [];

  const recommendations = mapCandidatesToRecommendations(googleCandidates, input);
  const provider = googleCandidates.length ? "google_maps" : mapsEnabled ? "google_maps_fallback" : "mock_rules";
  const requestId = await saveRouteRequest(input, recommendations, userEmail ?? null);

  return {
    requestId,
    provider,
    mapsEnabled,
    origin,
    recommendations,
    candidateCount: googleCandidates.length,
  };
}
