// Spot-checks content on representative DoltLab docs pages.
export {};

const timeout = 10000;

function assertPageContent(path: string, expectedH1: string) {
  cy.visit(path);
  cy.get("h1", { timeout }).should("be.visible").and("contain", expectedH1);
  cy.get("body").invoke("text").should("have.length.above", 500);
}

describe("DoltLab docs — page content spot checks", () => {
  context("Homepage", () => {
    it("homepage loads and has content", () => {
      cy.visit("/");
      cy.get("h1", { timeout }).should("be.visible");
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
    it("Why Enterprise? page has correct heading", () => {
      assertPageContent("/enterprise/why", "Why Enterprise");
    });
  });

  context("Guides", () => {
    it("Installation overview has correct heading", () => {
      assertPageContent("/guides/installation", "Installation");
    });

    it("Basic administrator guide has correct heading", () => {
      assertPageContent("/guides/basic", "Basic");
    });

    it("Enterprise administrator guide has correct heading", () => {
      assertPageContent("/guides/enterprise", "Enterprise");
    });
  });

  context("Features", () => {
    it("Basic Features page has correct heading", () => {
      assertPageContent("/features/basic", "Basic Features");
    });

    it("Advanced Features page has correct heading", () => {
      assertPageContent("/features/advanced", "Advanced Features");
    });
  });

  context("Reference", () => {
    it("Installer reference has correct heading", () => {
      assertPageContent("/reference/installer", "Installer");
    });

    it("Release Notes index has correct heading", () => {
      assertPageContent("/reference/release-notes", "Release Notes");
    });

    it("latest release note page has correct heading", () => {
      assertPageContent("/reference/release-notes/v2.5.4", "v2.5.4");
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

  context("Redirects from .gitbook.yaml", () => {
    const redirects: Array<{ from: string; description: string }> = [
      { from: "/guides/administrator", description: "legacy admin guide" },
      { from: "/guides/features", description: "legacy features path" },
      {
        from: "/guides/features/api",
        description: "legacy features/api path",
      },
      { from: "/release-notes", description: "legacy release-notes root" },
    ];

    redirects.forEach(({ from, description }) => {
      it(`redirect works: ${description}`, () => {
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
