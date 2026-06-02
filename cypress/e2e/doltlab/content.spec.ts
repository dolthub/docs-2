// Spot-checks content on representative DoltLab docs pages.
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

describe("DoltLab docs — page content spot checks", () => {
  context("Homepage", () => {
    it("docs root redirects to What is DoltLab?", () => {
      cy.visit("/");
      cy.location("pathname", { timeout }).should(
        "match",
        /\/introduction\/what-is-doltlab\/?$/,
      );
      cy.get("h1", { timeout })
        .should("be.visible")
        .and("contain", "What is DoltLab");
      cy.get("body").invoke("text").should("have.length.above", 200);
    });
  });

  context("Introduction", () => {
    it("What is DoltLab? has correct heading", () => {
      assertPageContent("/introduction/what-is-doltlab", "What is DoltLab");
    });

    it("Getting Started page has correct heading", () => {
      assertPageContent(
        "/introduction/getting-started/getting-started",
        "Getting Started",
      );
    });
  });

  context("Enterprise", () => {
    it("Why Enterprise? page loads with content", () => {
      assertPageLoads("/enterprise/why");
    });
  });

  context("Guides", () => {
    it("Installation overview has correct heading", () => {
      assertPageContent("/guides/installation", "Supported operating systems");
    });

    it("Basic administrator guide has correct heading", () => {
      assertPageContent("/guides/basic", "Basic Administrator Guide");
    });

    it("Enterprise administrator guide has correct heading", () => {
      assertPageContent("/guides/enterprise", "Enterprise Administrator Guide");
    });
  });

  context("Features", () => {
    it("Basic Features page loads with content", () => {
      assertPageLoads("/features/basic");
    });

    it("Advanced Features page loads with content", () => {
      assertPageLoads("/features/advanced");
    });
  });

  context("Reference", () => {
    it("Installer reference loads with content", () => {
      assertPageLoads("/reference/installer");
    });

    it("Release Notes index loads with content", () => {
      assertPageLoads("/reference/release-notes");
    });

    it("latest release note page loads with content", () => {
      assertPageLoads("/reference/release-notes/v2.5.4");
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
      cy.contains("a", "DoltLab documentation home").should("be.visible");
      // The .md-alternate hint is part of the helpful 404 — guard it so we
      // don't accidentally drop it later.
      cy.contains("append").should("be.visible");
      cy.contains(".md").should("be.visible");
    });
  });
});
