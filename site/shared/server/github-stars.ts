// Server/build-only: share one request across every page in a site's build.
// DoltHub's GraphQL service caches the upstream GitHub response for ten minutes.
const fallbackCount = 19300;
let countPromise: Promise<number> | undefined;

export function getGithubStarCount(): Promise<number> {
  return (countPromise ??= fetch("https://www.dolthub.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationName: "doltStarCount",
      query: "query doltStarCount { doltStarCount { count } }",
    }),
    signal: AbortSignal.timeout(5000),
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      const count = result?.data?.doltStarCount?.count;
      if (!Number.isInteger(count) || count < 0) {
        throw new Error("Invalid GitHub star count");
      }
      return count as number;
    })
    .catch((error) => {
      console.warn("Could not load GitHub stars; using fallback count.", error);
      return fallbackCount;
    }));
}
