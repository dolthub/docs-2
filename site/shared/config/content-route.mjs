// Maps a content Markdown file to the route slug it should be served at.
//
// `key` is an `import.meta.glob` key for a file under a site's
// `src/content`, e.g. "../content/reference/sql/server/backups.md". The
// returned slug has no leading slash and is what the `[...slug].astro`
// catch-all route emits.
//
// Rules (reverse-engineered from the old per-page .astro wrappers):
//   - every site: `.../README` is the section index (drop the README)
//   - dolt:      `reference/cli/…`  -> `cli-reference/…`
//                `reference/sql/…`  -> `sql-reference/…`
//   - doltgres:  `reference/sql/…`  -> `reference/…` (drop the `sql` segment;
//                `reference/sql-support` / `reference/benchmarks` are left alone)
//   - doltlab:   no remap
export function contentRouteSlug(key, site) {
  let p = key.replace(/^.*\/content\//, "").replace(/\.md$/, "");

  // README is the index of its directory.
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
