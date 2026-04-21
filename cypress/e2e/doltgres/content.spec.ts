// Spot-checks content on representative Doltgres docs pages.
export {};

const timeout = 10000;

function assertPageContent(path: string, expectedH1: string) {
  cy.visit(path);
  cy.get("h1", { timeout }).should("be.visible").and("contain", expectedH1);
  cy.get("body").invoke("text").should("have.length.above", 500);
}

function assertPageLoads(path: string) {
  cy.visit(path);
  cy.get("body", { timeout }).invoke("text").should("have.length.above", 200);
}

describe("Doltgres docs — page content spot checks", () => {
  context("Homepage", () => {
    it("homepage loads and has content", () => {
      cy.visit("/");
      cy.get("body", { timeout }).invoke("text").should("have.length.above", 200);
    });
  });

  context("Introduction", () => {
    it("Introduction page loads with content", () => {
      assertPageLoads("/introduction");
    });

    it("Installation page loads with content", () => {
      assertPageLoads("/introduction/installation");
    });

    it("Getting Started page loads with content", () => {
      assertPageLoads("/introduction/getting-started");
    });
  });

  context("Concepts", () => {
    it("Git concepts page loads with content", () => {
      assertPageLoads("/concepts/git");
    });

    it("Commits page has correct heading", () => {
      assertPageContent("/concepts/git/commits", "Commits");
    });

    it("SQL concepts page loads with content", () => {
      assertPageLoads("/concepts/sql");
    });
  });

  context("Guides", () => {
    it("Cheat Sheet has correct heading", () => {
      assertPageContent("/guides/cheat-sheet", "Cheat Sheet");
    });

    it("Replication from Postgres page loads with content", () => {
      assertPageLoads("/guides/replication-from-postgres");
    });
  });

  context("Reference", () => {
    it("Server page has correct heading", () => {
      assertPageContent("/reference/server", "Configuration options");
    });

    it("Version Control page has correct heading", () => {
      assertPageContent("/reference/version-control", "Version control overview");
    });

    it("SQL Language Support page loads with content", () => {
      assertPageLoads("/reference/sql-support");
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
  });
});
