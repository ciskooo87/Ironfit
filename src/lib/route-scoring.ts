import { MapsRouteCandidate } from "@/lib/google-maps";
import { RouteInput, RouteRecommendation } from "@/lib/routefit-data";

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `route-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function kmFromMeters(value: number) {
  return Number((value / 1000).toFixed(1));
}

export function scoreCandidate(kind: RouteRecommendation["kind"], candidate: MapsRouteCandidate, input: RouteInput): RouteRecommendation {
  const distanceKm = kmFromMeters(candidate.distanceMeters);
  const diff = Math.abs(distanceKm - input.distance);
  const fitDistancePenalty = diff * 6;
  const prefersSafety = input.preferences.includes("evitar trânsito") || input.preferences.includes("mais ciclovia");
  const prefersFlow = input.preferences.includes("menos cruzamentos") || input.trainingType === "ritmo";
  const prefersClimb = input.preferences.includes("buscar subida") || input.trainingType === "subida";
  const avoidsClimb = input.preferences.includes("evitar subida");

  let safetyScore = 78 - candidate.warnings!.length * 5 + (prefersSafety ? 8 : 0);
  let trafficScore = kind === "Mais segura" ? 88 : kind === "Performance" ? 73 : 80;
  let flowScore = kind === "Performance" ? 88 : prefersFlow ? 82 : 75;
  let trainingFitScore = 90 - fitDistancePenalty;
  let popularityScore = kind === "Mais segura" ? 74 : 68;
  let elevationScore = prefersClimb ? 84 : avoidsClimb ? 78 : 72;
  const estimatedMinutes = Math.round(candidate.durationSeconds / 60);
  const elevationGain = kind === "Performance" ? 170 : kind === "Mais segura" ? 65 : 110;

  if (kind === "Performance") {
    trainingFitScore += 5;
    trafficScore -= 4;
  }
  if (kind === "Mais segura") {
    safetyScore += 10;
    flowScore -= 3;
  }
  if (kind === "Melhor geral") {
    trainingFitScore += 3;
  }

  const overallScore = Math.round(
    safetyScore * 0.24 +
      trainingFitScore * 0.24 +
      trafficScore * 0.16 +
      elevationScore * 0.14 +
      flowScore * 0.14 +
      popularityScore * 0.08
  );

  return {
    id: makeId(),
    kind,
    title: `${kind} · ${candidate.waypointLabel}`,
    distanceKm,
    estimatedMinutes,
    elevationGain,
    overallScore: clamp(overallScore),
    safetyScore: clamp(Math.round(safetyScore)),
    trainingFitScore: clamp(Math.round(trainingFitScore)),
    trafficScore: clamp(Math.round(trafficScore)),
    elevationScore: clamp(Math.round(elevationScore)),
    flowScore: clamp(Math.round(flowScore)),
    popularityScore: clamp(Math.round(popularityScore)),
    attentionPoints: candidate.warnings?.length ? candidate.warnings : ["Validar pontos de cruzamento e iluminação no horário real."],
    recommendationReason:
      kind === "Melhor geral"
        ? "Entre as candidatas reais, esta equilibra melhor aderência ao treino, previsibilidade e segurança geral."
        : kind === "Performance"
          ? "Entre as candidatas reais, esta prioriza continuidade e encaixe mais forte com esforço de performance."
          : "Entre as candidatas reais, esta reduz exposição a alertas e prioriza uma leitura mais conservadora de segurança.",
    mapSummary: candidate.summary || candidate.waypointLabel,
    polyline: candidate.polyline,
  };
}
