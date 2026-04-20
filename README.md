# docs-2

This repository will become the new home of the DoltHub documentation sites, replacing the current [GitBook](https://www.gitbook.com/)-hosted sites. The goal is to match the look and feel of the [DoltHub blog](https://www.dolthub.com/blog/) — same navbar and footer from [`dolthub/react-library`](https://github.com/dolthub/react-library).

**Current live sites (GitBook):**
- Dolt — https://docs.dolthub.com
- DoltLab — https://docs.doltlab.com
- Doltgres — https://docs.doltgres.com

**Source content:** [`dolthub/docs`](https://github.com/dolthub/docs)

## Cypress migration tests

Before migrating frameworks, we wrote Cypress tests against the current GitBook sites to establish a baseline. Once the new site is built, the same tests run against it to verify no pages were lost and content is intact.

### What is tested

Each docs site has three spec files:

| Spec | What it checks |
|------|---------------|
| `page-existence.spec.ts` | Every page from `SUMMARY.md` returns HTTP 200 (uses `cy.request()` — fast) |
| `content.spec.ts` | Representative pages load with the correct `h1` heading and non-empty body |
| `navigation.spec.ts` | Homepage loads, unknown URLs return 404, legacy redirects still resolve *(dolt only)* |

### Running the tests

```sh
npm install

# Dolt (docs.dolthub.com)
npx cypress run
npx cypress open          # interactive mode

# DoltLab (docs.doltlab.com)
npx cypress run --config-file cypress.doltlab.config.ts
npx cypress open --config-file cypress.doltlab.config.ts

# Doltgres (docs.doltgres.com)
npx cypress run --config-file cypress.doltgres.config.ts
npx cypress open --config-file cypress.doltgres.config.ts
```

To run against a local dev server instead of the live site, override `baseUrl`:

```sh
npx cypress open --config baseUrl=http://localhost:3000
```

### CI

GitHub Actions runs the full suite on every pull request and on a daily schedule (to catch drift if the live sites change). Three jobs run in parallel — one per docs site — so a failure in one doesn't block the others.

See [`.github/workflows/cypress.yaml`](.github/workflows/cypress.yaml).

### URL structure notes

The current `docs.dolthub.com` uses URL prefixes that differ from the `SUMMARY.md` file paths in the source repo:

| SUMMARY.md path prefix | Live URL prefix |
|------------------------|-----------------|
| `reference/sql/…` | `/sql-reference/…` |
| `reference/cli/…` | `/cli-reference/…` |

Old `/reference/sql/*` paths redirect to `/sql-reference/*`, so external links keep working. When building the new site, decide whether to keep this structure or normalize it (and add the corresponding redirects).
