export type Modality = "corrida" | "bike";
export type TrainingType = "leve" | "endurance" | "subida" | "intervalado" | "ritmo";
export type RouteKind = "Melhor geral" | "Performance" | "Mais segura";

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `route-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export type RouteInput = {
  location: string;
  date: string;
  time: string;
  modality: Modality;
  distance: number;
  trainingType: TrainingType;
  preferences: string[];
};

export type RouteRecommendation = {
  id: string;
  kind: RouteKind;
  title: string;
  distanceKm: number;
  estimatedMinutes: number;
  elevationGain: number;
  overallScore: number;
  safetyScore: number;
  trainingFitScore: number;
  trafficScore: number;
  elevationScore: number;
  flowScore: number;
  popularityScore: number;
  attentionPoints: string[];
  recommendationReason: string;
  mapSummary: string;
  polyline?: string;
  geometryAvailable?: boolean;
};

export const trainingOptions: TrainingType[] = ["leve", "endurance", "subida", "intervalado", "ritmo"];

export const preferenceOptions = [
  "evitar trânsito",
  "priorizar parque",
  "rota circular",
  "menos cruzamentos",
  "mais ciclovia",
  "mais sombra",
  "evitar subida",
  "buscar subida",
  "mais movimento",
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function estimateBasePace(modality: Modality, trainingType: TrainingType) {
  if (modality === "corrida") {
    if (trainingType === "leve") return 6.4;
    if (trainingType === "endurance") return 5.9;
    if (trainingType === "intervalado") return 5.1;
    if (trainingType === "ritmo") return 5.4;
    return 6.2;
  }

  if (trainingType === "leve") return 2.7;
  if (trainingType === "endurance") return 2.3;
  if (trainingType === "intervalado") return 2.0;
  if (trainingType === "ritmo") return 2.1;
  return 2.5;
}

function buildRoute(kind: RouteKind, input: RouteInput): RouteRecommendation {
  const baseDistance = input.distance;
  const pace = estimateBasePace(input.modality, input.trainingType);
  const wantsSafety = input.preferences.includes("evitar trânsito") || input.preferences.includes("mais movimento");
  const wantsPark = input.preferences.includes("priorizar parque");
  const wantsCircle = input.preferences.includes("rota circular");
  const wantsBikeInfra = input.preferences.includes("mais ciclovia");
  const wantsClimb = input.preferences.includes("buscar subida");
  const avoidsClimb = input.preferences.includes("evitar subida");
  const wantsFlow = input.preferences.includes("menos cruzamentos");

  let distanceKm = baseDistance;
  let safetyScore = 72;
  let trainingFitScore = 75;
  let trafficScore = 70;
  let elevationScore = 70;
  let flowScore = 68;
  let popularityScore = 62;
  let elevationGain = input.modality === "corrida" ? 80 : 140;
  const attentionPoints = ["Validar iluminação e movimento real perto do horário escolhido."];

  if (kind === "Melhor geral") {
    distanceKm = Number((baseDistance * 1.01).toFixed(1));
    safetyScore += wantsSafety ? 10 : 4;
    trainingFitScore += 10;
    trafficScore += wantsPark ? 8 : 5;
    elevationScore += wantsClimb ? 4 : avoidsClimb ? 8 : 5;
    flowScore += wantsFlow ? 9 : 6;
    popularityScore += wantsPark ? 7 : 4;
    elevationGain = input.trainingType === "subida" ? 210 : input.trainingType === "leve" ? 60 : elevationGain;
    attentionPoints.push("Pode ter variação de fluxo em horário de pico na saída do bairro.");
  }

  if (kind === "Performance") {
    distanceKm = Number((baseDistance * 1.04).toFixed(1));
    safetyScore += wantsSafety ? 4 : 1;
    trainingFitScore += 18;
    trafficScore += 4;
    elevationScore += input.trainingType === "subida" || wantsClimb ? 16 : 7;
    flowScore += 12;
    popularityScore += 5;
    elevationGain = input.trainingType === "subida" ? 320 : input.trainingType === "intervalado" ? 110 : 170;
    attentionPoints.push("Trecho mais exigente fisicamente e menos tolerante a interrupções.");
  }

  if (kind === "Mais segura") {
    distanceKm = Number((baseDistance * 0.98).toFixed(1));
    safetyScore += 18;
    trainingFitScore += 7;
    trafficScore += 15;
    elevationScore += avoidsClimb ? 12 : 5;
    flowScore += 8;
    popularityScore += 12;
    elevationGain = input.trainingType === "subida" ? 150 : 55;
    attentionPoints.push("Pode sacrificar ritmo para manter vias mais previsíveis e protegidas.");
  }

  if (wantsBikeInfra && input.modality === "bike") {
    safetyScore += 8;
    flowScore += 5;
    popularityScore += 4;
  }

  if (wantsCircle) {
    flowScore += 4;
  }

  const overallScore = Math.round(
    safetyScore * 0.24 +
      trainingFitScore * 0.24 +
      trafficScore * 0.16 +
      elevationScore * 0.14 +
      flowScore * 0.14 +
      popularityScore * 0.08
  );

  const estimatedMinutes = Math.round(distanceKm * pace + (elevationGain / 100) * (input.modality === "corrida" ? 2.2 : 1.3));
  const title = `${kind} · ${input.modality === "corrida" ? "Corrida" : "Bike"} em ${input.location}`;

  const recommendationReason =
    kind === "Melhor geral"
      ? "Equilibra segurança, aderência ao treino e fluidez, sem sacrificar demais o ritmo ou a previsibilidade do trajeto."
      : kind === "Performance"
        ? "Prioriza continuidade, esforço útil para o treino e estímulo físico mais alinhado com performance."
        : "Favorece vias mais controladas, menor exposição a conflito com trânsito e leitura mais conservadora de risco.";

  const mapSummary =
    kind === "Melhor geral"
      ? "Loop misto com saída urbana leve, trecho principal fluido e retorno previsível."
      : kind === "Performance"
        ? "Trajeto com menos interrupção, blocos mais longos e melhor consistência para ritmo."
        : "Rota com preferência por parque, vias mais calmas ou infraestrutura cicloviária quando disponível.";

  return {
    id: makeId(),
    kind,
    title,
    distanceKm,
    estimatedMinutes,
    elevationGain,
    overallScore: clamp(overallScore),
    safetyScore: clamp(safetyScore),
    trainingFitScore: clamp(trainingFitScore),
    trafficScore: clamp(trafficScore),
    elevationScore: clamp(elevationScore),
    flowScore: clamp(flowScore),
    popularityScore: clamp(popularityScore),
    attentionPoints,
    recommendationReason,
    mapSummary,
  };
}

export function normalizeInput(searchParams: Record<string, unknown>, defaults?: Partial<RouteInput>): RouteInput {
  const get = (key: string, fallback = "") => {
    const value = searchParams[key];
    if (Array.isArray(value)) return String(value[0] ?? fallback);
    if (value == null) return fallback;
    return String(value);
  };

  const rawPreferences = searchParams["preferences"];
  const preferences = Array.isArray(rawPreferences)
    ? rawPreferences.map((item) => String(item).trim()).filter(Boolean)
    : typeof rawPreferences === "string"
      ? rawPreferences.split(",").map((item) => item.trim()).filter(Boolean)
      : defaults?.preferences?.length
        ? defaults.preferences
        : ["evitar trânsito", "rota circular"];

  const defaultModality = defaults?.modality === "bike" ? "bike" : "corrida";
  const defaultTrainingType = defaults?.trainingType && trainingOptions.includes(defaults.trainingType as TrainingType)
    ? defaults.trainingType
    : "leve";

  return {
    location: get("location", defaults?.location || "Ibirapuera, São Paulo"),
    date: get("date", defaults?.date || "2026-05-05"),
    time: get("time", defaults?.time || "06:00"),
    modality: get("modality", defaultModality) === "bike" ? "bike" : "corrida",
    distance: Number(get("distance", String(defaults?.distance || 10))) || defaults?.distance || 10,
    trainingType: (trainingOptions.includes(get("trainingType", String(defaultTrainingType)) as TrainingType)
      ? get("trainingType", String(defaultTrainingType))
      : defaultTrainingType) as TrainingType,
    preferences,
  };
}

export function generateRecommendations(input: RouteInput) {
  return [
    buildRoute("Melhor geral", input),
    buildRoute("Performance", input),
    buildRoute("Mais segura", input),
  ].sort((a, b) => b.overallScore - a.overallScore);
}

export function getMockHistory() {
  return [
    {
      id: "hist-1",
      title: "Corrida leve · Ibirapuera",
      date: "2026-05-02 06:10",
      summary: "10 km · Melhor geral · score 88",
    },
    {
      id: "hist-2",
      title: "Bike endurance · Lagoa Rodrigo de Freitas",
      date: "2026-05-01 05:50",
      summary: "42 km · Performance · score 91",
    },
    {
      id: "hist-3",
      title: "Corrida subida · Praça do Papa",
      date: "2026-04-29 07:00",
      summary: "12 km · Performance · score 84",
    },
  ];
}
