# Lessons from Neon's "Agents Grew Up, So Did Our Docs"

Source: <https://neon.com/blog/agents-grew-up-so-did-our-docs>

A read-through of Neon's post, and an honest pass at which lessons would
actually move the needle for *our* docs (vs. things they had to do because
they were MDX-based / had 1,400 pages / etc.).

## Lessons from the post

Grouped by theme, not by ranking.

### Markdown as the primary agent-readable format
- Convert MDX → plain Markdown at build time so agents never see component
  tags like `<SharedContent>`.
- Inline shared content snippets before serving.
- Serve Markdown from the *same* canonical URL via either a `.md` suffix or
  the `Accept: text/markdown` request header. Don't put agent content under
  a parallel namespace like `/llms/...`.
- Send `Vary: Accept` so intermediaries cache HTML and Markdown separately.

### Discovery: tell the agent what else is available
- Hierarchical `llms.txt` — not a flat 1,000-entry list. Sections with
  descriptions, sub-indexes for large areas (changelog, API), a
  "Common Queries" pin at the top. Aim around 200 entries in the primary index.
- Publish `llms.txt` at both the root and `/docs/llms.txt` — placement
  conventions still vary.
- Add `<link rel="alternate" type="text/markdown" href="…">` in every HTML
  `<head>` so agents (and feed readers) auto-discover the Markdown version.
- Breadcrumbs at the top of every page; "Related docs" links at the bottom —
  helps agents find the next page without re-querying the whole site.

### Be a good citizen to non-human clients
- Detect agents by broader User-Agent patterns (axios, got, node-fetch) in
  addition to the named LLM crawlers.
- Honour content negotiation silently — agents shouldn't have to know the
  `.md` trick exists if they send the right `Accept` header.
- Track agent traffic in analytics so you can see *which* pages agents 404 on
  or abandon.

### 404s that don't dead-end
- Return a real `404` status (not `200` with empty content).
- Content-type aware: if Markdown was requested, return a Markdown 404.
- The 404 body should link to `llms.txt` and the full docs bundle, not just
  "back to home."

### Treat docs like code
- Build pipeline that generates the agent surface (Markdown alternates,
  `llms.txt`, indexes) automatically, so nothing drifts.
- Test that agents can actually *complete a task* from your docs, not just
  parse them. Community tools like `afdocs` flag coverage gaps.
- Don't ship hand-maintained parallel text files — they're stale within weeks.

### Anti-patterns Neon explicitly calls out
- Hand-maintained `llms.txt` (drifts).
- Raw MDX with unresolved component tags.
- One flat 1,000+-entry index.
- "Committing `.claude` folders into every repo" — manage them like
  devDependencies instead. (Aside from the docs problem, more of a process
  point.)

## Where we stand today

| Area | Current state |
|------|---------------|
| Content format | Plain Markdown already — **139 files on dolt, no MDX**. Half of Neon's pipeline work doesn't apply to us. |
| Markdown alternates at the doc URL | None. HTML only. |
| `llms.txt` | None on any site. |
| `<link rel="alternate">` in `<head>` | None. |
| `_headers` / content negotiation | No `_headers` file. |
| Breadcrumbs / related docs | Neither. Page is title + body + sidebar. |
| Custom 404 | Exists (`site/dolt/src/pages/404.astro`) but it's a one-liner — "back to home" only. |
| Frontmatter | `title` only — no `description`, no `tags`. |
| Build pipeline | Three site-specific `npm run build:*` scripts; no post-build step we'd hook into. |
| Robots / sitemap | No `robots.txt`, no generated sitemap. |
| Agent analytics | Cloudflare Pages analytics only — no agent-specific breakdown. |

## Lessons worth applying to us

Ranked roughly by leverage-per-effort.

### High value, low cost

1. **Emit `<path>.md` for every doc page.** Add a sibling catch-all
   (`[...slug].md.ts` or similar) that re-serves the source Markdown at
   the `.md` suffix. Trivially cheap — the markdown already exists. This
   alone covers most of what agents want, and it's the recommendation Neon
   leads with.
2. **Generate `llms.txt` at build time** from `nav.ts` + frontmatter.
   Hierarchical (one section per top-level nav node), with each entry
   linking to the `.md` URL and including a one-line description from
   frontmatter. Per-site at `/docs/llms.txt` + a copy at the bundle root.
   Add `description` to frontmatter as a separate small step.
3. **`<link rel="alternate" type="text/markdown">`** in the layout `<head>`,
   pointing at the same page's `.md` URL. One line in `DocsLayout.astro`.
4. **Beef up `404.astro`** to link to `llms.txt` and the sitemap, not just
   home. We already have a 404 file — just expand it.
5. **`site/dolt/_headers`** with `Vary: Accept` on `/docs/*` and a long
   `Cache-Control` on `*.md`. Tiny file, free win.

### Medium value

6. **Breadcrumbs** at the top of every page — derive from the URL path and
   nav. Useful for humans too, not just agents. About a day of layout work.
7. **"Related docs" footer** — derive from `nav.ts` siblings/parents.
   Already have the nav data, so this is purely a render pass.
8. **`Accept: text/markdown` content negotiation** at the edge — Cloudflare
   Pages can do this via Functions / Workers. Lower priority since the `.md`
   suffix covers most agents, but it removes the "agent needs to know the
   trick" friction.
9. **`description` in frontmatter** for every page. Mostly a content task —
   a one-line per file. We've already mentioned this for the `llms.txt`
   entries; the same field powers OG / Twitter cards.

### Low value or doesn't apply to us

- MDX → MD conversion — we're already plain MD.
- Inlining `<SharedContent>` — we barely share content via includes.
- "Common Queries" section at the top of `llms.txt` — useful at Neon-scale,
  not at ours.
- Sub-indexes for huge sections — none of our sections are that big.
- The `.claude` devDependency aside — not a docs concern.
- Agent-traffic analytics dashboards — nice-to-have, not until we ship the
  baseline above.

## Suggested rollout

**Phase 1 (one PR, ~half a day):** items 1, 3, 4, 5 from the high-value list.
That gives every page a `.md` URL discoverable via `<link rel="alternate">`,
a useful 404, and content-negotiation hints — without touching content or
nav. Tested with a cypress check: `cy.request("/docs/foo.md")` returns
`text/markdown` matching the source.

**Phase 2 (one PR, ~a day):** item 2 — generated `llms.txt`. Frontmatter
`description` field added to a sample of high-traffic pages first;
remaining pages can fall back to the H1.

**Phase 3 (optional, as content work):** breadcrumbs + related-docs + the
rest of the `description` rollout. Stretch goals.

The reason for that ordering: Phase 1 unlocks 80% of the agent UX with zero
content changes. Phase 2 needs a tiny build script and one new frontmatter
key. Phase 3 is the more invasive layout work — worth doing but doesn't
unblock anything Phase 1/2 doesn't already deliver.
