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
const SITE_TITLE = "Dolt";
const SITE_BLURB =
  "Dolt is a SQL database you can branch, diff, merge, and clone like a Git repository. It speaks the MySQL wire protocol, so existing clients, drivers, and ORMs connect with no changes — but underneath, every commit is a queryable snapshot of your data and schema that you can diff, revert, and review.";

// Extra paragraphs that follow the blockquote summary at the top of llms.txt
// — context about when Dolt is the right tool and what the product family
// looks like. These don't live on any particular doc page, so they're kept
// here rather than pulled from frontmatter.
const SITE_INTRO_PARAGRAPHS = [
  "Reach for Dolt when you need to know exactly who changed what and when, run experiments on data in isolated branches, review data changes in a pull request before they land in production, or hand an AI agent a database it cannot silently corrupt — because every change is committed, diffable, and revertible.",
  "The Dolt family: **Dolt** is the open-source database (run it locally or as a server); **Hosted Dolt** is Dolt as a managed cloud service; **DoltHub** is the hosted Git server for sharing Dolt databases, with pull requests and a public data catalog; **DoltLab** is self-hosted DoltHub; **Dolt Workbench** is a GUI; and **DoltgreSQL** is the Postgres-compatible version.",
  "Because Dolt speaks the MySQL wire protocol, it works with the tools you already use — Python, Go, Node.js, Java, Ruby, and PHP, ORMs like SQLAlchemy, Prisma, GORM, and ActiveRecord, and GUI clients like DataGrip, TablePlus, DBeaver, and MySQL Workbench — using their standard MySQL drivers, no special client required.",
];

// Section-specific entries that aren't doc pages (so they aren't in nav.ts)
// but belong in the agent-facing index. Keyed by the nav section the entry
// should be appended to.
const EXTRA_SECTION_ENTRIES: Record<
  string,
  { title: string; url: string; description: string }[]
> = {
  Introduction: [
    {
      title: "Agentic Writes with Dolt",
      url: "https://dolthub.com/blog/2026-06-04-agentic-writes/",
      description:
        "How AI agents should write to databases safely — the branch-per-task, commit-per-action, revert-on-failure pattern that makes autonomous agent writes recoverable and auditable. Why Dolt is the right data layer for agent pipelines that can't afford silent data corruption.",
    },
  ],
};

// Standalone section appended after the nav-driven sections. Same shape as
// EXTRA_SECTION_ENTRIES values; broken out so it can hold full URLs to
// non-docs destinations (GitHub, blog, Discord).
const COMMUNITY_SECTION = {
  title: "Community & Source",
  entries: [
    {
      title: "Dolt on GitHub",
      url: "https://github.com/dolthub/dolt",
      description:
        "The open-source database — source code, issue tracker, releases, and discussions. Bug reports and feature requests go here.",
    },
    {
      title: "go-mysql-server on GitHub",
      url: "https://github.com/dolthub/go-mysql-server",
      description:
        "Dolt's MySQL-compatible SQL engine, also usable as a standalone Go library.",
    },
    {
      title: "DoltgreSQL on GitHub",
      url: "https://github.com/dolthub/doltgresql",
      description:
        "Source and issues for the Postgres-compatible build of Dolt.",
    },
    {
      title: "DoltHub Blog",
      url: "https://dolthub.com/blog",
      description:
        "Deep technical writeups, release notes, benchmarks, and comparisons — the best source for \"how does X actually work\" and \"Dolt vs. Y\" answers.",
    },
    {
      title: "Discord",
      url: "https://discord.com/invite/RFwfYpu",
      description:
        "Ask questions and reach the Dolt engineering team directly.",
    },
  ],
};

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
  for (const para of SITE_INTRO_PARAGRAPHS) body += `${para}\n\n`;
  for (const section of nav) {
    body += `## ${section.section}\n\n`;
    body += renderItems(section.items, origin);
    for (const extra of EXTRA_SECTION_ENTRIES[section.section] ?? []) {
      body += `- [${extra.title}](${extra.url}): ${extra.description}\n`;
    }
    body += "\n";
  }
  body += `## ${COMMUNITY_SECTION.title}\n\n`;
  for (const e of COMMUNITY_SECTION.entries) {
    body += `- [${e.title}](${e.url}): ${e.description}\n`;
  }
  // One trailing blank line — matches the conventional llmstxt.org file shape.
  body += "\n";
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
