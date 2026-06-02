// Verifies the Markdown alternates emitted by pages/[...slug].md.ts.
// Every doc page is also served at <doc-url>.md with the raw source —
// agents and other non-HTML consumers can fetch that and skip the HTML
// parse. The HTML version advertises the alternate via
// <link rel="alternate" type="text/markdown">.
export {};

const timeout = 10000;

describe("Dolt docs — Markdown alternates", () => {
  it("a content page is served as raw Markdown at the .md suffix", () => {
    cy.request("/introduction/installation.md").then(response => {
      expect(response.status).to.eq(200);
      // Frontmatter preserved as-authored.
      expect(response.body).to.match(/^---\s*\ntitle:/);
      expect(response.body).to.include("Installation");
    });
  });

  it("the HTML page advertises the .md alternate in its <head>", () => {
    cy.visit("/introduction/installation");
    cy.get('link[rel="alternate"][type="text/markdown"]', { timeout })
      .should("have.attr", "href")
      .and("match", /\/docs\/introduction\/installation\.md$/);
  });

  it("a deeper nested page works too", () => {
    cy.request("/sql-reference/server/configuration.md").then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.match(/^---\s*\ntitle:/);
    });
  });

  it("an unknown .md path returns 404", () => {
    cy.request({
      url: "/does-not-exist.md",
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(404);
    });
  });
});
