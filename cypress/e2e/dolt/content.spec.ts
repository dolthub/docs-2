// Spot-checks content on representative Dolt docs pages.
export {};
// Verifies that each page:
//   1. Loads successfully
//   2. Has an h1 containing the expected title
//   3. Has visible body content
//
// One page per major section is checked here. The full URL coverage is
// handled by page-existence.spec.ts.

const timeout = 10000;

function assertPageContent(path: string, expectedH1: string) {
  cy.visit(path);
  cy.get("h1", { timeout }).should("be.visible").and("contain", expectedH1);
  // Verify there is some meaningful content below the heading
  cy.get("body").invoke("text").should("have.length.above", 500);
}

describe("Dolt docs — page content spot checks", () => {
  context("Introduction", () => {
    it("What Is Dolt? has correct heading and content", () => {
      assertPageContent("/introduction/what-is-dolt", "What Is Dolt");
    });

    it("Installation page has correct heading", () => {
      assertPageContent("/introduction/installation", "Installation");
    });

    it("Getting Started page has correct heading", () => {
      assertPageContent("/introduction/getting-started", "Getting Started");
    });

    it("Use Cases page has correct heading", () => {
      assertPageContent("/introduction/use-cases", "Use Cases");
    });
  });

  context("Concepts", () => {
    it("Dolt concepts overview has correct heading", () => {
      assertPageContent("/concepts/dolt", "Dolt");
    });

    it("Git concepts page has correct heading", () => {
      assertPageContent("/concepts/dolt/git", "Git");
    });

    it("Commits page has correct heading", () => {
      assertPageContent("/concepts/dolt/git/commits", "Commits");
    });

    it("SQL concepts page has correct heading", () => {
      assertPageContent("/concepts/dolt/sql", "SQL");
    });

    it("DoltHub/DoltLab concepts page has correct heading", () => {
      assertPageContent("/concepts/dolthub", "DoltHub");
    });
  });

  context("SQL Reference", () => {
    it("Running the Server page has correct heading", () => {
      assertPageContent("/sql-reference/server", "Running the Server");
    });

    it("Configuration page has correct heading", () => {
      assertPageContent("/sql-reference/server/configuration", "Configuration");
    });

    it("Version Control Features page has correct heading", () => {
      assertPageContent(
        "/sql-reference/version-control",
        "Version Control Features",
      );
    });

    it("SQL Language Support page has correct heading", () => {
      assertPageContent("/sql-reference/sql-support", "SQL Language Support");
    });

    it("Procedures page has correct heading", () => {
      assertPageContent(
        "/sql-reference/version-control/dolt-sql-procedures",
        "Procedures",
      );
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
      assertPageContent("/cli-reference/cli", "Commands");
    });

    it("Git Comparison page has correct heading", () => {
      assertPageContent("/cli-reference/git-comparison", "Git Comparison");
    });
  });

  context("Architecture", () => {
    it("Architecture overview has correct heading", () => {
      assertPageContent("/architecture/architecture", "Overview");
    });

    it("Prolly Trees page has correct heading", () => {
      assertPageContent(
        "/architecture/storage-engine/prolly-tree",
        "Prolly Trees",
      );
    });
  });

  context("Guides", () => {
    it("Cheat Sheet has correct heading", () => {
      assertPageContent("/guides/cheat-sheet", "Cheat Sheet");
    });

    it("Importing Data page has correct heading", () => {
      assertPageContent("/guides/import", "Importing Data");
    });
  });

  context("Other", () => {
    it("FAQ page has correct heading", () => {
      assertPageContent("/other/faq", "FAQ");
    });

    it("Roadmap page has correct heading", () => {
      assertPageContent("/other/roadmap", "Roadmap");
    });
  });

  context("Products", () => {
    it("Hosted Dolt overview has correct heading", () => {
      assertPageContent("/products/hosted", "Hosted Dolt");
    });

    it("DoltHub overview has correct heading", () => {
      assertPageContent("/products/dolthub", "DoltHub");
    });

    it("DoltHub API page has correct heading", () => {
      assertPageContent("/products/dolthub/api", "API");
    });
  });
});
