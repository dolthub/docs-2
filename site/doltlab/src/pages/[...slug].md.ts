// Serves the raw Markdown source at <doc-url>.md alongside the HTML page —
// e.g. /docs/guides/basic.md mirrors /docs/guides/basic. LLM agents and other
// non-HTML consumers can fetch the .md suffix and skip the HTML parse. Same
// content file, same route slug (contentRouteSlug), so the two URLs always
// refer to the same source.
import type { APIRoute } from "astro";
import { contentRouteSlug } from "../../../shared/config/content-route.mjs";

const SITE = "doltlab";

export function getStaticPaths() {
  // ?raw loads each file as a string instead of a parsed Astro module —
  // that way the bytes we serve are exactly what's in src/content/.
  const modules = import.meta.glob("../content/**/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  });
  return Object.entries(modules)
    .filter(([file]) => !file.includes("/.gitbook/"))
    .map(([file, source]) => ({
      params: { slug: contentRouteSlug(file, SITE) },
      props: { source: source as string },
    }))
    // Skip the root README — index.astro handles "/" already, and "/.md" isn't
    // a useful URL.
    .filter(p => p.params.slug);
}

export const GET: APIRoute = ({ props }) => {
  return new Response(props.source as string, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
