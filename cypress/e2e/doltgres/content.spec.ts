// Spot-checks content on representative Doltgres docs pages.
export {};

const timeout = 10000;

function assertPageContent(path: string, expectedH1: string) {
  cy.visit(path);
  cy.get("h1", { timeout }).should("be.visible").and("contain", expectedH1);
  cy.get("body").invoke("text").should("have.length.above", 500);
}

describe("Doltgres docs — page content spot checks", () => {
  context("Homepage", () => {
    it("homepage loads and has content", () => {
      cy.visit("/");
      cy.get("h1", { timeout }).should("be.visible");
    });
  });

  context("Introduction", () => {
    it("What is Doltgres? has correct heading", () => {
      assertPageContent("/introduction", "Doltgres");
    });

    it("Installation page has correct heading", () => {
      assertPageContent("/introduction/installation", "Installation");
    });

    it("Getting Started page has correct heading", () => {
      assertPageContent("/introduction/getting-started", "Getting Started");
    });
  });

  context("Concepts", () => {
    it("Git concepts page has correct heading", () => {
      assertPageContent("/concepts/git", "Git");
    });

    it("Commits page has correct heading", () => {
      assertPageContent("/concepts/git/commits", "Commits");
    });

    it("SQL concepts page has correct heading", () => {
      assertPageContent("/concepts/sql", "SQL");
    });
  });

  context("Guides", () => {
    it("Cheat Sheet has correct heading", () => {
      assertPageContent("/guides/cheat-sheet", "Cheat Sheet");
    });

    it("Replication from Postgres has correct heading", () => {
      assertPageContent(
        "/guides/replication-from-postgres",
        "Replication from Postgres",
      );
    });
  });

  context("Reference", () => {
    it("Running the Server page has correct heading", () => {
      assertPageContent("/reference/sql/server", "Running the Server");
    });

    it("Version Control Features page has correct heading", () => {
      assertPageContent(
        "/reference/sql/version-control",
        "Version Control Features",
      );
    });

    it("SQL Language Support page has correct heading", () => {
      assertPageContent("/reference/sql-support", "SQL Language Support");
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
