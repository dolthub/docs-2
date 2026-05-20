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
      cy.contains("a", "Back to Dolt documentation home").should("be.visible");
    });
  });

  // Legacy redirects from the old GitBook site live in `site/dolt/_redirects`
  // and 301 at the Cloudflare layer (e.g. `/docs/reference/sql/configuration`
  // → `/docs/sql-reference/server/configuration`). They can't be exercised
  // against `astro preview` because `_redirects` is a Cloudflare-only
  // directive; verify them post-deploy.
});
