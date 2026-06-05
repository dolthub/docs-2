# DoltHub API docs: cleanup + v2 plan

Two related but separable bodies of work:

1. **Reorganise the existing v1alpha1 docs** so endpoints are discoverable
   and grouped by what they do, not by accident of history.
2. **Add v2** (generated from an OpenAPI spec, side-by-side with v1alpha1)
   in a way that doesn't make the current mess worse.

The cleanup is worth doing whether or not v2 ships, and it pays for itself
the moment we have to maintain two versions in parallel.

---

## Part 1 — Cleanup of the current docs

### What's there today

`site/dolt/src/content/products/dolthub/api/` — seven hand-written
pages templated from `scripts/api-source/*.md`. The templates embed
`{% swagger src=… path=… method=… %}` tags that get expanded by
`scripts/generate-api-docs.py` into HTML endpoint blocks, against
OpenAPI 3.0 JSON specs in
`site/dolt/src/content/.gitbook/assets/dolthub-api/` (23 files,
one per endpoint).

The current pages and their sizes:

| Page | Lines | What's on it |
|---|---:|---|
| `README.md` | 5 | Two-sentence intro |
| `authentication.md` | 22 | Token + Basic Auth |
| `sql.md` | 329 | Read and write SQL over HTTP |
| `csv.md` | 75 | CSV export and bulk import |
| **`database.md`** | **957** | **Create db, list, fork, file upload, jobs, branches, tags, releases, *and* pull requests** |
| `hooks.md` | 139 | Webhooks |
| `user.md` | 38 | Current user info |

### Problems

1. **`database.md` is a 957-line junk drawer.** It mixes database lifecycle,
   pull-request workflow, branch management, tags/releases, file uploads,
   and the import/merge job system. None of these are easy to find unless
   you already know they're in there.
2. **Mixed organising principle.** The other pages are organised by
   capability (sql, csv, hooks); `database.md` is organised by "everything
   that didn't fit elsewhere."
3. **No endpoint index.** 23 endpoints live in the swagger JSON, but you
   can't see them all in one place — you'd have to read every page.
4. **Authentication is one-off.** Every page tells you to "see the
   Authentication section" but doesn't have a self-contained
   "this endpoint requires auth" callout.
5. **Hooks sits oddly at the top level.** It's a webhook surface attached
   to a database — closer to the database lifecycle than to "API surface."
6. **No version context.** The URL prefix is `/products/dolthub/api/` with
   no version disambiguation, but every endpoint is v1alpha1. Adding v2
   without first naming the version makes it worse.
7. **Custom Python generator.** `scripts/generate-api-docs.py` reinvents
   what tools like Redocly or widdershins already do. The renderer also
   produces inline HTML (`<div class="api-endpoint">…`) that we then style
   in `DocsLayout.astro` — bespoke styling per docs page is something
   we've been moving away from.

### Proposed page layout

Split `database.md` apart along resource boundaries; keep the rest. Final
shape:

```
products/dolthub/api/
  README.md                # Overview + endpoint index
  authentication.md        # Tokens, Basic Auth, scopes
  sql.md                   # Read/write SQL (unchanged)
  csv.md                   # Export + bulk import (unchanged)
  databases.md             # Create, list, fork
  branches.md              # Create, list (new — extracted from database.md)
  pull-requests.md         # Create, list, get, update, comment, merge (new)
  releases.md              # Create, list (new)
  tags.md                  # Create, list (new)
  uploads.md               # File upload + transform (new)
  jobs.md                  # Import job + merge job polling, list operations (new)
  webhooks.md              # Renamed from hooks.md
  user.md                  # Unchanged
```

Splitting `database.md` is the largest piece — each new file pulls its
endpoint block from the existing template and the existing swagger JSON.
No new swagger work.

### Cross-page improvements

- **Endpoint index** on `README.md`: a single table listing every method
  + path + one-line summary + link to the doc section, generated at build
  time from the swagger JSON (so it can't drift).
- **Auth callout component**. A small `<AuthRequired />` Astro snippet
  that renders the same "this endpoint needs a token; see Authentication"
  box on every endpoint that needs auth. Beats prose-level repetition.
- **Anchor every endpoint.** Today the section IDs are organic
  (`### Create database` → `#create-database`); make them explicit and
  stable so external pages can deep-link.
- **Version label in the page header** ("v1alpha1") on every API page,
  even before v2 lands. Lays the groundwork for the version switcher.
- **Switch the renderer.** Two options, in order of preference:
  1. **Redocly CLI** (`@redocly/cli build-docs --output-format markdown`)
     against a per-page OpenAPI spec. Zero custom code, output is
     standard Markdown that the rest of the site renders normally.
  2. Keep `generate-api-docs.py` but stop emitting raw HTML — generate
     plain Markdown tables + headings. Saves the custom CSS in
     `DocsLayout.astro` and works with the `.md` alternates / `llms.txt`
     pipeline.

  Either way the input stays the existing OpenAPI 3.0 JSONs.

### Suggested rollout

Three small PRs, each independently mergeable:

1. **Split `database.md`** into the proposed per-resource pages. No
   content rewrite — just move endpoints into the right files. Update
   `nav.ts` and `cypress/fixtures/dolt-pages.ts` to match. Add the
   version label.
2. **Add the endpoint index** to `README.md`. Wire it into the
   build script so it regenerates from the JSON specs.
3. **Switch the renderer** to clean Markdown (Redocly or rewritten
   Python). This is the biggest visual change and is worth doing in
   its own PR so it can be reviewed against screenshots.

The auth callout + stable anchors can ride along with PR 1.

---

## Part 2 — Adding v2

### Constraint

v2 docs will be **generated from an OpenAPI spec** (your note). That
shapes the rest of the plan: the input is canonical, we don't hand-edit
endpoint pages, and the toolchain has to handle full-page regen on every
spec change without losing hand-written context (intros, examples).

### Site layout

Surface v1alpha1 and v2 as siblings under `products/dolthub/api/`,
version in the URL:

```
products/dolthub/api/
  README.md                       # Landing — versions, what's new, when to use which
  v1alpha1/
    README.md                     # v1alpha1 overview + endpoint index
    authentication.md
    sql.md
    …(the cleaned-up Part-1 layout, moved under v1alpha1/)
  v2/
    README.md                     # v2 overview + endpoint index
    authentication.md
    …(generated)
```

URLs become `/products/dolthub/api/v2/sql`, `/products/dolthub/api/v1alpha1/sql`,
etc. — explicit, stable, and grep-able.

Reasons for path-based versioning rather than a version switcher widget:

- Markdown URLs (`<url>.md` per the Phase-1 agent-readable work) stay
  unambiguous — each version's source is at a distinct URL.
- `llms.txt` entries can carry the version prefix in the title.
- Each version's pages are independently reachable from search and from
  external links.
- No client-side JS needed to "switch versions" — the URL *is* the
  version.

### Generation pipeline

Per-page Markdown rendered from the OpenAPI spec. Recommended tooling:

- **Redocly CLI** (`@redocly/cli build-docs`) — produces a static
  Markdown bundle from an OpenAPI 3.0/3.1 spec. Pluggable theming, good
  output, actively maintained.
- Alternative: **widdershins** — older but stable; outputs slate-style
  Markdown. Works fine if Redocly's output doesn't match our style.

Either way, the source of truth is one spec file
(`openapi/dolthub-v2.json` or `.yaml`) checked into this repo. The
build script regenerates the v2 pages on every build, so a spec change
flows through end-to-end without manual editing of the rendered pages.

### Hand-written vs generated

Generated:

- One file per resource grouping (`databases.md`, `sql.md`, `branches.md`,
  etc.), produced from the spec. **Do not hand-edit these** — they get
  overwritten.
- A `endpoints.md` (or fold into the v2 `README.md`) with every endpoint
  in one table, also generated.

Hand-written:

- `v2/README.md` (front matter + a hand-written intro and "what's new
  in v2" section). The endpoint index below it is templated.
- `v2/authentication.md` — narrative + examples, not just spec-derived
  field tables.
- `api/README.md` — top-level landing that points at both versions and
  explains when to use which.

### Handling both versions in parallel

- **Endpoints with no v2 equivalent** stay only in v1alpha1; v2's
  equivalent file is generated empty (or omitted). The version landing
  page calls out which resources moved or were removed.
- **Deprecation header on v1alpha1 pages**: a small banner at the top of
  every v1alpha1 doc page once v2 ships, pointing at the v2 equivalent.
  Renders from a `deprecated_by:` frontmatter field on each page so the
  link is per-page.
- **Each version page gets a "v1alpha1" or "v2" label** in the page
  header, so a reader landing from a search engine knows which they're
  on without having to look at the URL.
- **`llms.txt` entries** get a version prefix:
  `- [SQL (v2)](…/v2/sql.md): …` so an agent picking a doc knows which
  version it's reading.

### Suggested rollout

Two PRs:

1. **Restructure the URL space.** Move existing pages from
   `api/` → `api/v1alpha1/`, add the top-level `api/README.md` landing,
   add `_redirects` so the old URLs forward. No v2 content yet.
2. **Wire up v2.** Commit the OpenAPI spec, the generator (Redocly CLI
   command + a `generate-api-v2` npm script), and the first generated
   pages. Add `v2/` to `nav.ts`, the cypress fixture, and `llms.txt`.

Each PR builds and tests cleanly on its own; v2 doesn't have to be ready
before the v1alpha1 cleanup ships.

### Open questions

- **Spec authority.** Where does the v2 OpenAPI spec live — in this repo,
  or in the dolthub app repo with a sync step? Both are workable; the
  trade-off is "docs review is closer to docs" vs. "spec stays next to
  the implementation."
- **Visual richness.** Redocly's default output is plain. If we want the
  three-column "spec + example + sample response" layout (like Stripe's
  docs), that's a bigger lift — likely a custom Astro renderer that reads
  the spec at build time rather than a Markdown-export tool. Worth a
  separate decision.
- **`v1alpha1` lifecycle.** When does v1alpha1 deprecate? "When v2 is
  GA" is fine; pick the cutoff so we know when to stop running both
  generators and writing both sets of intro pages.
