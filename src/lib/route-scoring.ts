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

function parseFactor(label: string) {
  const match = label.match(/fator\s+([0-9.]+)/i);
  return match ? Number(match[1]) : 0.3;
}

function parseBearing(label: string) {
  const match = label.match(/Loop\s+(\d+)°/i);
  return match ? Number(match[1]) : 0;
}

export function scoreCandidate(kind: RouteRecommendation["kind"], candidate: MapsRouteCandidate, input: RouteInput): RouteRecommendation {
  const distanceKm = kmFromMeters(candidate.distanceMeters);
  const diff = Math.abs(distanceKm - input.distance);
  const fitDistancePenalty = diff * 6;
  const prefersSafety = input.preferences.includes("evitar trânsito") || input.preferences.includes("mais ciclovia") || input.preferences.includes("mais movimento");
  const prefersFlow = input.preferences.includes("menos cruzamentos") || input.trainingType === "ritmo";
  const prefersClimb = input.preferences.includes("buscar subida") || input.trainingType === "subida";
  const avoidsClimb = input.preferences.includes("evitar subida");
  const prefersPark = input.preferences.includes("priorizar parque") || input.preferences.includes("mais sombra");
  const prefersCircle = input.preferences.includes("rota circular");

  const factor = parseFactor(candidate.waypointLabel);
  const bearing = parseBearing(candidate.waypointLabel);
  const bearingIsCardinal = bearing % 90 === 0;
  const bearingIsDiagonal = bearing % 90 !== 0;

  let safetyScore = 78 - (candidate.warnings?.length || 0) * 5 + (prefersSafety ? 8 : 0);
  let trafficScore = kind === "Mais segura" ? 88 : kind === "Performance" ? 73 : 80;
  let flowScore = kind === "Performance" ? 88 : prefersFlow ? 82 : 75;
  let trainingFitScore = 90 - fitDistancePenalty;
  let popularityScore = kind === "Mais segura" ? 74 : 68;
  let elevationScore = prefersClimb ? 84 : avoidsClimb ? 78 : 72;
  const estimatedMinutes = Math.round(candidate.durationSeconds / 60);
  let elevationGain = kind === "Performance" ? 170 : kind === "Mais segura" ? 65 : 110;

  if (kind === "Performance") {
    trainingFitScore += 6;
    flowScore += 5;
    trafficScore -= 4;
    if (factor >= 0.34) trainingFitScore += 4;
    if (bearingIsDiagonal) flowScore += 3;
  }

  if (kind === "Mais segura") {
    safetyScore += 10;
    flowScore -= 2;
    if (bearingIsCardinal) safetyScore += 4;
    if (factor <= 0.3) trafficScore += 4;
  }

  if (kind === "Melhor geral") {
    trainingFitScore += 3;
    if (factor >= 0.3 && factor <= 0.34) trainingFitScore += 3;
  }

  if (prefersPark) {
    popularityScore += 8;
    safetyScore += 4;
    if (bearingIsDiagonal) popularityScore += 3;
  }

  if (prefersCircle) {
    flowScore += 6;
    trainingFitScore += 3;
    if (factor <= 0.3) flowScore += 3;
  }

  if (prefersFlow) {
    flowScore += 7;
    if (bearingIsDiagonal) flowScore += 4;
  }

  if (prefersSafety) {
    safetyScore += 6;
    trafficScore += 6;
    if (bearingIsCardinal) safetyScore += 3;
  }

  if (prefersClimb) {
    elevationScore += 10;
    trainingFitScore += 4;
    elevationGain += 60;
    if (factor >= 0.34) elevationScore += 4;
  }

  if (avoidsClimb) {
    elevationScore += 8;
    if (factor <= 0.3) elevationScore += 4;
    elevationGain = Math.max(35, elevationGain - 40);
  }

  const overallScore = Math.round(
    safetyScore * 0.22 +
      trainingFitScore * 0.24 +
      trafficScore * 0.16 +
      elevationScore * 0.14 +
      flowScore * 0.16 +
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
