// Prefixes the configured docs base path onto root-relative URLs so the
// suite works whether the site is served at the domain root (the live
// GitBook site) or under a base path like /docs (the Astro build).
//
// `basePath` is set per cypress config (e.g. "/docs"). Live runs override it
// to empty via `--env basePath=`, making this a no-op. Idempotent: paths
// already under the base (e.g. rendered-link pathnames) and absolute URLs
// are returned unchanged.
export function withBase(p: string): string {
  if (typeof p !== "string") return p;
  const base = String(Cypress.env("basePath") || "").replace(/\/+$/, "");
  if (!base || !p.startsWith("/")) return p;
  if (p === base || p.startsWith(base + "/")) return p;
  return base + p;
}
