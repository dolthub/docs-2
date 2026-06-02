// Tests that the site navigation structure is intact.
export {};

const timeout = 10000;

describe("Dolt docs — navigation and structure", () => {
  context("Homepage", () => {
    it("docs root redirects to What Is Dolt?", () => {
      cy.visit("/");
      cy.location("pathname", { timeout }).should(
        "match",
        /\/introduction\/what-is-dolt\/?$/,
      );
      cy.get("h1", { timeout }).should("be.visible").and("contain", "What is Dolt");
      cy.get("body").invoke("text").should("have.length.above", 200);
    });
  });

  context("404 handling", () => {
    it("unknown page returns 404", () => {
      cy.request({
        url: "/this-page-does-not-exist",
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });

    it("renders the custom 404 page", () => {
      cy.visit("/this-page-does-not-exist", { failOnStatusCode: false });
      cy.get("h1", { timeout }).should("be.visible").and("contain", "Page not found");
      cy.contains("a", "Dolt documentation home").should("be.visible");
      // Mention of the .md alternate is part of the helpful 404 — verify
      // it's surfaced so we don't accidentally drop it later.
      cy.contains("append").should("be.visible");
      cy.contains(".md").should("be.visible");
    });
  });

  // Legacy redirects from the old GitBook site live in `site/dolt/_redirects`
  // and 301 at the Cloudflare layer (e.g. `/docs/reference/sql/configuration`
  // → `/docs/sql-reference/server/configuration`). They can't be exercised
  // against `astro preview` because `_redirects` is a Cloudflare-only
  // directive; verify them post-deploy.

  // /reference/{sql,cli}/<slug> are alternate URLs that resolve to the
  // canonical /sql-reference/<slug> and /cli-reference/<slug>. In prod,
  // Cloudflare 301s via `_redirects`; in dev, the static stubs under
  // src/pages/reference/{sql,cli}/[...slug].astro meta-refresh in their
  // place. Either way the visitor ends up on the canonical page.
  context("alternate /reference/sql and /reference/cli paths still work", () => {
    it("/reference/sql/server lands on /sql-reference/server", () => {
      cy.visit("/reference/sql/server");
      cy.location("pathname", { timeout }).should(
        "match",
        /\/sql-reference\/server\/?$/,
      );
      cy.get("h1", { timeout }).should("contain", "Running the Dolt SQL Server");
    });
    it("/reference/cli/cli lands on /cli-reference/cli", () => {
      cy.visit("/reference/cli/cli");
      cy.location("pathname", { timeout }).should(
        "match",
        /\/cli-reference\/cli\/?$/,
      );
      cy.get("h1", { timeout }).should("contain", "Command Line Interface");
    });
  });
});
