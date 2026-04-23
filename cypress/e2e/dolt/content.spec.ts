// Spot-checks content on representative Dolt docs pages.
export {};
// Verifies that each page:
//   1. Loads successfully
//   2. Has the expected heading or meaningful content
//
// One page per major section is checked here. The full URL coverage is
// handled by page-existence.spec.ts.

const timeout = 10000;

function assertPageContent(path: string, expectedH1: string) {
  cy.visit(path);
  cy.get("h1", { timeout }).should("be.visible").and("contain", expectedH1);
  cy.get("body").invoke("text").should("have.length.above", 500);
}

// For section index pages (README.md) that may not have an h1
function assertPageLoads(path: string) {
  cy.visit(path);
  cy.get("body", { timeout }).invoke("text").should("have.length.above", 200);
}

describe("Dolt docs — page content spot checks", () => {
  context("Introduction", () => {
    it("What Is Dolt? has correct heading and content", () => {
      assertPageContent("/introduction/what-is-dolt", "What is Dolt");
    });

    it("Installation page has correct heading", () => {
      assertPageContent("/introduction/installation", "Installation");
    });

    it("Getting Started page loads with content", () => {
      assertPageLoads("/introduction/getting-started");
    });

    it("Use Cases page loads with content", () => {
      assertPageLoads("/introduction/use-cases");
    });
  });

  context("Concepts", () => {
    it("Dolt concepts overview has correct heading", () => {
      assertPageContent("/concepts/dolt", "Dolt");
    });

    it("Git concepts page loads with content", () => {
      assertPageLoads("/concepts/dolt/git");
    });

    it("Commits page has correct heading", () => {
      assertPageContent("/concepts/dolt/git/commits", "Commits");
    });

    it("SQL concepts page loads with content", () => {
      assertPageLoads("/concepts/dolt/sql");
    });

    it("DoltHub/DoltLab concepts page has correct heading", () => {
      assertPageContent("/concepts/dolthub", "DoltHub");
    });
  });

  context("SQL Reference", () => {
    it("Running the Server page has correct heading", () => {
      assertPageContent("/sql-reference/server", "Running the Dolt SQL Server");
    });

    it("Configuration page has correct heading", () => {
      assertPageContent("/sql-reference/server/configuration", "Configuration");
    });

    it("Version Control page has correct heading", () => {
      assertPageContent(
        "/sql-reference/version-control",
        "Version Control in Dolt",
      );
    });

    it("SQL Language Support page loads with content", () => {
      assertPageLoads("/sql-reference/sql-support");
    });

    it("Procedures page loads with content", () => {
      assertPageLoads("/sql-reference/version-control/dolt-sql-procedures");
    });

    it("System Tables page has correct heading", () => {
      assertPageContent(
        "/sql-reference/version-control/dolt-system-tables",
        "System Tables",
      );
    });
  });

  context("CLI Reference", () => {
    it("Commands page has correct heading", () => {
      assertPageContent("/cli-reference/cli", "CLI");
    });

    it("Git Comparison page loads with content", () => {
      assertPageLoads("/cli-reference/git-comparison");
    });
  });

  context("Architecture", () => {
    it("Architecture overview has correct heading", () => {
      assertPageContent("/architecture/architecture", "Architecture");
    });

    it("Prolly Trees page has correct heading", () => {
      assertPageContent(
        "/architecture/storage-engine/prolly-tree",
        "Prolly Tree",
      );
    });
  });

  context("Guides", () => {
    it("Cheat Sheet has correct heading", () => {
      assertPageContent("/guides/cheat-sheet", "Cheat Sheet");
    });

    it("Importing Data page has correct heading", () => {
      assertPageContent("/guides/import", "Get data into Dolt");
    });
  });

  context("Other", () => {
    it("FAQ page loads with content", () => {
      assertPageLoads("/other/faq");
    });

    it("Roadmap page has correct heading", () => {
      assertPageContent("/other/roadmap", "Roadmap");
    });
  });

  context("Products", () => {
    it("Hosted Dolt overview loads with content", () => {
      assertPageLoads("/products/hosted");
    });

    it("DoltHub overview has correct heading", () => {
      assertPageContent("/products/dolthub", "DoltHub");
    });

    it("DoltHub API page has correct heading", () => {
      assertPageContent("/products/dolthub/api", "API");
    });
  });
});
