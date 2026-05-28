---
name: Docs site migration project
description: Context for the docs-2 repo — migrating DoltHub docs from GitBook to a new framework with the blog's navbar/footer
type: project
---

Migrating https://docs.dolthub.com (and docs.doltlab.com, docs.doltgres.com) from GitBook to a new framework that uses the react-library navbar/footer to match the blog at https://www.dolthub.com/blog/.

Source docs live in https://github.com/dolthub/docs (packages/dolt, packages/doltlab, packages/doltgres).

**Why:** Want consistent look/feel (navbar + footer from dolthub/react-library) across docs and blog.

**How to apply:** This repo (docs-2) will become the new docs site. The Cypress tests in this repo test the current GitBook site as a baseline; after migration the same tests run against the new site to catch regressions.

## Key URL quirks discovered

The live docs.dolthub.com uses URL prefixes that differ from SUMMARY.md file paths:
- SQL reference: `/sql-reference/` (not `/reference/sql/`)
- CLI reference: `/cli-reference/` (not `/reference/cli/`)
- Old `/reference/sql/*` paths **do** redirect → `/sql-reference/*` (GitBook handles these)
- Some `.gitbook.yaml` redirects are **not** live: `/getting-started/dolthub`, `/guides/dolthub-api/`, `/guides/doltlab/`, `/concepts/dolthub/api` all return 404

## Cypress test suite (43 dolt tests, all passing)

- `cypress.config.ts` → dolt (docs.dolthub.com)
- `cypress.doltlab.config.ts` → doltlab (docs.doltlab.com)  
- `cypress.doltgres.config.ts` → doltgres (docs.doltgres.com)
- `cypress/fixtures/dolt-pages.ts` — full page list organized by section
- `cypress/e2e/dolt/page-existence.spec.ts` — cy.request() bulk 200 check
- `cypress/e2e/dolt/content.spec.ts` — cy.visit() + h1 spot checks
- `cypress/e2e/dolt/navigation.spec.ts` — homepage, 404, verified redirects
- doltlab and doltgres have page-existence + content specs (not yet run against live)

Run: `npm install && npx cypress run` (dolt), or with `--config-file` flag for other sites.
