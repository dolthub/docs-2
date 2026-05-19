# Contributing

How to edit, review, and ship docs changes.

## Where content lives

Each site is an independent Astro app under `site/`. Page content is plain markdown:

| Site     | Content                      | Sidebar nav                | Page wrappers             |
|----------|------------------------------|----------------------------|---------------------------|
| Dolt     | `site/dolt/src/content/`     | `site/dolt/src/nav.ts`     | `site/dolt/src/pages/`     |
| DoltLab  | `site/doltlab/src/content/`  | `site/doltlab/src/nav.ts`  | `site/doltlab/src/pages/`  |
| Doltgres | `site/doltgres/src/content/` | `site/doltgres/src/nav.ts` | `site/doltgres/src/pages/` |

The content file path mirrors the URL path (`introduction/installation.md` → `/docs/introduction/installation`), with two URL remappings: `reference/sql/…` is served at `/sql-reference/…`, and `reference/cli/…` at `/cli-reference/…`. Shared layout and components live in `site/shared/`.

## Editing an existing page

Edit the markdown file under `site/<site>/src/content/…` and preview locally:

```sh
cd site/<site>
npm install --legacy-peer-deps    # first time only
npm run dev                       # http://localhost:432x/docs
```

(Ports: dolt `4321`, doltlab `4322`, doltgres `4323`.)

## Adding a new page

1. **Markdown** — create `site/<site>/src/content/<section>/<slug>.md` with frontmatter:

   ```md
   ---
   title: My Page
   ---

   # My Page

   …content…
   ```

2. **Page wrapper** — create `site/<site>/src/pages/<section>/<slug>.astro` that renders the markdown through `DocsLayout`. Copy a sibling page as a template.
3. **Sidebar** — add the page to `site/<site>/src/nav.ts`.
4. **Tests** — add the route to `cypress/fixtures/<site>-pages.ts` so the page-existence / single-h1 tests cover it.

## Workflow

| Branch          | What happens on merge |
|-----------------|----------------------|
| feature branch  | CI runs Cypress + builds on the PR |
| `dev`           | Cloudflare Pages auto-deploys to each site's **preview** environment |
| `prod`          | Cloudflare Pages auto-deploys to **production** (the URLs in [`README.md`](README.md)) |

1. Branch off `dev`, make changes, open a PR into `dev`.
2. Get a review; CI must pass.
3. Merge to `dev` → preview deploys. Verify on the dev sites:
   - Dolt — https://dolthub.awsdev.ld-corp.com/docs/
   - DoltLab — https://doltlab.awsdev.ld-corp.com/docs/
   - Doltgres — https://doltgres.awsdev.ld-corp.com/docs/
4. When ready to ship, open a PR `dev` → `prod` and merge. Cloudflare auto-deploys to production.

> `dev` is the repo's default/integration branch — there is no `main`.

## Caveats

- **`cli.md` is generated**, not hand-edited. To update it, run `dolt dump-docs --file=site/dolt/src/content/reference/cli/cli.md` from a Dolt binary at the right version, then `chmod 644`.
- **Internal links** are site-absolute with no `.md` extension. Use the URL form: `/sql-reference/version-control/dolt-sql-procedures#dolt_merge`, `/cli-reference/cli#dolt-status`, etc. A rehype plugin prepends the `/docs` base at build time, so write links *without* `/docs/`. Same-page anchors stay as `#anchor`.
- **Images** must use *relative* paths (e.g. `../../.gitbook/assets/foo.png`) so Astro's asset pipeline can fingerprint them. Don't use absolute `/…` for images.
- **Code blocks need a language** for syntax highlighting. Common: `sql` (incl. `mysql>` sessions — `mysql` isn't a Shiki grammar, use `sql`), `bash` (shell sessions), `text` (plain output / `+---+` result tables), `yaml`, `go`, `python`, `json`, `diff`, `ini`. Leave bare only when nothing fits.
- **Each page has exactly one `# H1`** matching the frontmatter `title`. Demote any extra upstream H1s to `##` (and shift downstream levels accordingly). The `single-h1.spec.ts` Cypress check enforces this.

## Cypress tests

Each docs site has spec files exercising the built Astro site:

| Spec | What it checks |
|------|---------------|
| `page-existence.spec.ts` | Every known page returns HTTP 200 (uses `cy.request()` — fast) |
| `content.spec.ts` | Representative pages load with the correct `h1` heading and non-empty body |
| `navigation.spec.ts` | Docs root redirects to the intro, unknown URLs return 404 *(dolt only)* |
| `dead-links.spec.ts` | In-content links resolve |
| `single-h1.spec.ts` | Each page has exactly one `<h1>` |

### Running the tests

The suites run against a local `astro preview` server by default. Build the site, start preview, then run Cypress:

```sh
npm install

# Dolt — build, start preview (port 4321), run Cypress
npm run build:dolt
npm run preview:dolt &
npx cypress run
npx cypress open                              # interactive mode

# DoltLab (port 4322)
npm run build:doltlab
npm run preview:doltlab &
npx cypress run --config-file cypress.doltlab.config.ts

# Doltgres (port 4323)
npm run build:doltgres
npm run preview:doltgres &
npx cypress run --config-file cypress.doltgres.config.ts
```

To test the legacy GitBook sites (the original migration baseline) instead, point at the live URL and disable our `/docs` base prefix:

```sh
npx cypress run --config baseUrl=https://docs.dolthub.com --env basePath=
```

### CI

GitHub Actions runs the full suite on every pull request. Three jobs run in parallel — one per docs site — so a failure in one doesn't block the others. See [`.github/workflows/cypress.yaml`](.github/workflows/cypress.yaml).
