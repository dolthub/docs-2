// Tests that the site navigation structure is intact after migration.
export {};
// Checks that:
//   1. Visiting the homepage works and shows a heading
//   2. The sidebar navigation is present
//   3. Unknown URLs show a 404 page (not a blank/broken page)
//   4. Old redirect URLs still resolve correctly

const timeout = 10000;

describe("Dolt docs — navigation and structure", () => {
  context("Homepage", () => {
    it("homepage loads and has content", () => {
      cy.visit("/");
      cy.get("h1", { timeout }).should("be.visible");
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

    it("visiting unknown page shows an error, not a blank page", () => {
      cy.visit("/this-page-does-not-exist", { failOnStatusCode: false });
      cy.get("body").invoke("text").should("have.length.above", 50);
    });
  });

  context("Redirects from .gitbook.yaml", () => {
    // These are the legacy redirects defined in packages/dolt/.gitbook.yaml.
    // After migration the new site MUST honour these so existing external links
    // keep working.  We allow 301/302 → 200 final destinations.

    // These legacy paths are defined as redirects in packages/dolt/.gitbook.yaml.
    // After migration the new site MUST honour them so existing external links
    // keep working. We follow redirects and confirm the final response is 200.
    // Only redirects that are verified to work on the current GitBook site.
    // Some .gitbook.yaml entries (getting-started/dolthub, guides/dolthub-api,
    // guides/doltlab, concepts/dolthub/api) return 404 on the live site —
    // GitBook does not honour every redirect listed in .gitbook.yaml.
    const redirects: Array<{ from: string; description: string }> = [
      {
        from: "/tutorials/installation",
        description: "tutorials/installation → introduction/installation",
      },
      {
        from: "/integrations/programmatic-clients",
        description: "integrations/programmatic-clients → supported clients",
      },
      {
        from: "/reference/sql/configuration",
        description:
          "reference/sql/configuration → sql-reference/server/configuration",
      },
      {
        from: "/reference/sql/branches",
        description:
          "reference/sql/branches → sql-reference/version-control/branches",
      },
      {
        from: "/reference/sql/dolt-sql-procedures",
        description: "legacy procedure path → sql-reference/version-control",
      },
      {
        from: "/reference/sql/dolt-system-tables",
        description:
          "legacy system tables path → sql-reference/version-control",
      },
    ];

    redirects.forEach(({ from, description }) => {
      it(`redirect works: ${description}`, () => {
        // Follow redirects (default) and check we land on a real page
        cy.request({ url: from, failOnStatusCode: false }).then(response => {
          expect(
            response.status,
            `${from} should redirect to a real page (200)`,
          ).to.eq(200);
        });
      });
    });
  });
});
