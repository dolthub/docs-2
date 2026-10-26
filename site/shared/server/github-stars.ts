// Server/build-only: share one request across every page in a site's build.
// DoltHub's GraphQL service caches the upstream GitHub response for ten minutes.
const counts = {
  dolt: { field: "doltStarCount", fallback: 19300 },
  doltgres: { field: "doltgresStarCount", fallback: 2183 },
};
const countPromises: Partial<Record<keyof typeof counts, Promise<number>>> = {};

export function getGithubStarCount(
  siteName: "dolt" | "doltlab" | "doltgres" = "dolt",
): Promise<number> {
  const repo = siteName === "doltgres" ? "doltgres" : "dolt";
  const { field, fallback } = counts[repo];
  return (countPromises[repo] ??= fetch("https://www.dolthub.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationName: field,
      query: `query ${field} { ${field} { count } }`,
    }),
    signal: AbortSignal.timeout(5000),
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      const count = result?.data?.[field]?.count;
      if (!Number.isInteger(count) || count < 0) {
        throw new Error("Invalid GitHub star count");
      }
      return count as number;
    })
    .catch((error) => {
      console.warn("Could not load GitHub stars; using fallback count.", error);
      return fallback;
    }));
}
