// Generates llms.txt — a hierarchical, agent-readable index of every page on
// this docs site. Spec: https://llmstxt.org. Each entry links to the page's
// raw Markdown alternate at <url>.md (see pages/[...slug].md.ts) so an agent
// can fetch the source directly. Structure is driven by nav.ts (so the order
// matches the sidebar); the description for each entry comes from the page's
// frontmatter `description:` field if present (falls back to nothing).
import type { APIRoute } from "astro";
import nav from "../nav";
import type { NavItem } from "../../../shared/components";
import { contentRouteSlug } from "../../../shared/config/content-route.mjs";

const SITE = "dolt";
const SITE_TITLE = "Dolt Documentation";
const SITE_BLURB =
  "Dolt is the world's first SQL database with Git-like branches, diffs, merges, and pull requests. It speaks the MySQL wire protocol and behaves like MySQL to clients; underneath, every commit is a snapshot of the data you can diff, branch, merge, and clone.";

// href -> { title, description } map, computed once at build time. The href
// matches the form authored in nav.ts (e.g. "/introduction/installation").
const modules = import.meta.glob("../content/**/*.md", { eager: true });
const meta = new Map<string, { title?: string; description?: string }>();
for (const [file, mod] of Object.entries(modules)) {
  if (file.includes("/.gitbook/")) continue;
  const slug = contentRouteSlug(file, SITE);
  if (!slug) continue;
  const fm = (mod as { frontmatter?: { title?: string; description?: string } })
    .frontmatter ?? {};
  meta.set(`/${slug}`, { title: fm.title, description: fm.description });
}

function renderItems(items: NavItem[], origin: string, depth = 0): string {
  let out = "";
  const indent = "  ".repeat(depth);
  for (const item of items) {
    if (item.href) {
      const m = meta.get(item.href) ?? {};
      const mdUrl = `${origin}/docs${item.href}.md`;
      const desc = m.description ? `: ${m.description}` : "";
      out += `${indent}- [${item.title}](${mdUrl})${desc}\n`;
    }
    if (item.children) {
      out += renderItems(item.children, origin, depth + 1);
    }
  }
  return out;
}

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "";
  let body = `# ${SITE_TITLE}\n\n> ${SITE_BLURB}\n\n`;
  for (const section of nav) {
    body += `## ${section.section}\n\n`;
    body += renderItems(section.items, origin);
    body += "\n";
  }
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
