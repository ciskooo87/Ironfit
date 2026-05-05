import { AppShell } from "@/components/AppShell";
import { RouteGeneratorClient } from "@/components/RouteGeneratorClient";
import { getIronfitProfile } from "@/lib/profile";
import { recommendRoutes } from "@/lib/route-engine";
import { normalizeInput } from "@/lib/routefit-data";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearch = await searchParams;
  const profile = await getIronfitProfile();
  const input = normalizeInput(resolvedSearch, {
    modality: profile.modality,
    trainingType: profile.trainingType,
    preferences: profile.preferences,
  });
  const recommendationResult = await recommendRoutes(input);
  const profileSaved = (Array.isArray(resolvedSearch.profileSaved) ? resolvedSearch.profileSaved[0] : resolvedSearch.profileSaved) === "1";

  return (
    <AppShell>
      <RouteGeneratorClient
        initialInput={input}
        initialRoutes={recommendationResult.recommendations}
        initialProvider={recommendationResult.provider}
        initialRequestId={recommendationResult.requestId}
        initialCandidateCount={recommendationResult.candidateCount}
        activeProfile={profile}
        profileSaved={profileSaved}
      />
    </AppShell>
  );
}
