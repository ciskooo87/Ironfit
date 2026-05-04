import { AppShell } from "@/components/AppShell";
import { RouteGeneratorClient } from "@/components/RouteGeneratorClient";
import { recommendRoutes } from "@/lib/route-engine";
import { normalizeInput } from "@/lib/routefit-data";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const input = normalizeInput(await searchParams);
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
