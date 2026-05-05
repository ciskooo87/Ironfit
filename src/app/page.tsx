import { AppShell } from "@/components/AppShell";
import { RouteGeneratorClient } from "@/components/RouteGeneratorClient";
import { getIronfitProfile } from "@/lib/profile";
import { recommendRoutes } from "@/lib/route-engine";
import { normalizeInput } from "@/lib/routefit-data";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const profile = await getIronfitProfile();
  const input = normalizeInput(await searchParams, {
    modality: profile.modality,
    trainingType: profile.trainingType,
    preferences: profile.preferences,
  });
  const recommendationResult = await recommendRoutes(input);

  return (
    <AppShell>
      <RouteGeneratorClient
        initialInput={input}
        initialRoutes={recommendationResult.recommendations}
        initialProvider={recommendationResult.provider}
        initialRequestId={recommendationResult.requestId}
        initialCandidateCount={recommendationResult.candidateCount}
      />
    </AppShell>
  );
}
