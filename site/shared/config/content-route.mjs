// Maps a content file's import.meta.glob key (e.g.
// "../content/reference/sql/server/backups.md") to its route slug (no leading
// slash) for the [...slug].astro catch-all. Remap rules:
//   - every site: `.../README` is the section index (drop the README)
//   - dolt:      `reference/cli/…` -> `cli-reference/…`, `reference/sql/…` -> `sql-reference/…`
//   - doltgres:  `reference/sql/…` -> `reference/…` (sql-support/benchmarks left alone)
//   - doltlab:   no remap
export function contentRouteSlug(key, site) {
  let p = key.replace(/^.*\/content\//, "").replace(/\.md$/, "");

  p = p.replace(/\/README$/, "");
  if (p === "README") p = "";

  if (site === "dolt") {
    p = p.replace(/^reference\/cli(\/|$)/, "cli-reference$1");
    p = p.replace(/^reference\/sql(\/|$)/, "sql-reference$1");
  } else if (site === "doltgres") {
    p = p.replace(/^reference\/sql(\/|$)/, "reference$1");
  }

  return p;
}
