// Tests for the shared site navbar: links, the Docs dropdown, the
// cookie-driven Sign In / Profile button, and the mobile menu. The navbar is a
// client-only React island, so the first assertion in each test uses `timeout`
// to allow for hydration. Cypress's default viewport (1000px) is below the
// `lg` breakpoint, so desktop/mobile viewports are set explicitly.
export {};

const timeout = 10000;
const page = "/introduction/what-is-dolt";
const dolthubTokenKey = "dolthubToken";

describe("Dolt docs — navbar", () => {
  beforeEach(() => {
    cy.intercept("https://api.github.com/repos/dolthub/dolt", {
      stargazers_count: 16000,
    });
  });
  context("desktop", () => {
    beforeEach(() => {
      cy.viewport(1280, 800);
      cy.clearCookies();
      cy.visit(page);
    });

    it("logo links to the docs home", () => {
      cy.get("[data-cy=navbar-logo]", { timeout })
        .should("be.visible")
        .and("have.attr", "href");
    });

    it("matches DoltHub's desktop navbar dimensions", () => {
      cy.get("[data-cy=navbar-logo]", { timeout })
        .filter(":visible")
        .find("img")
        .should(($logo) => {
          const rect = $logo[0].getBoundingClientRect();
          expect(rect.width).to.eq(112);
          expect(rect.height).to.eq(21);
        });
      cy.get(".navbar-slot header")
        .filter(":visible")
        .should("have.css", "height", "48px");
      cy.get(".navbar-right > a").each(($link) => {
        expect(getComputedStyle($link[0]).marginLeft).to.eq("8px");
        expect(getComputedStyle($link[0]).marginRight).to.eq("8px");
      });
      cy.get("[data-cy=navbar-products]").should(
        "have.css",
        "font-size",
        "14px",
      );
      if (Cypress.expose("navbarScreenshots")) {
        cy.screenshot("dolthub-navbar-spacing", { capture: "viewport" });
      }
      cy.get("[data-cy=navbar-products]").click();
      cy.get(".docs-navbar-products").should("have.css", "column-gap", "80px");
      cy.get("[data-cy=nav-product-dolt]").should("have.css", "width", "327px");
      if (Cypress.expose("navbarScreenshots")) {
        cy.screenshot("dolthub-products-spacing", { capture: "viewport" });
      }
    });

    it("left links point to DoltHub", () => {
      cy.get("[data-cy=navbar-products]", { timeout }).should("be.visible");
      cy.get("[data-cy=navbar-pricing]")
        .should("have.attr", "href")
        .and("include", "/pricing");
      cy.get("[data-cy=navbar-blog]")
        .should("have.attr", "href")
        .and("include", "/blog");
    });

    it("Docs dropdown opens the three product docs links", () => {
      cy.get("[data-cy=navbar-docs-menu]", { timeout }).click();
      cy.get(".docs-navbar-docs-links").should("be.visible");
      ["Dolt", "DoltLab", "DoltgreSQL"].forEach((name) => {
        cy.get(".docs-navbar-docs-links")
          .contains("a", name)
          .should("have.attr", "href");
      });
    });

    it("Products opens the product cards and hosting links", () => {
      cy.get("[data-cy=navbar-products]", { timeout }).click();
      [
        "dolt",
        "doltgresql",
        "doltlite",
        "dolthub",
        "doltlab",
        "dolt-workbench",
        "hosted-dolt",
      ].forEach((name) => {
        cy.get(`[data-cy=nav-product-${name}]`).should("be.visible");
      });
      cy.get("[data-cy=nav-product-dolthub]").should(
        "have.attr",
        "href",
        "https://www.dolthub.com/signin",
      );
      cy.contains("a", "Launch instance").should(
        "have.attr",
        "href",
        "https://hosted.doltdb.com/create-deployment",
      );
      cy.get("[data-cy=navbar-products]").click();
      cy.get(".docs-navbar-products").should("not.exist");
    });

    it("keeps the dark navbar and carries the docs theme between products", () => {
      cy.get("[aria-label='Switch to dark mode']", { timeout })
        .filter(":visible")
        .click();
      cy.get("html").should("have.class", "dark");
      cy.get("[data-cy=navbar-docs-menu]").click();
      cy.get("[data-cy=nav-docs-doltlab]").should(
        "have.attr",
        "href",
        "http://localhost:4322/docs?theme=dark",
      );
      cy.get("[data-cy=navbar-docs-menu]").click();
      cy.get("[aria-label='Switch to light mode']").filter(":visible").click();
      cy.get("html").should("not.have.class", "dark");
    });

    it("has Discord and GitHub external links", () => {
      cy.get("a[href*='discord.gg']", { timeout }).should("exist");
      cy.get("[data-cy=github-link]")
        .should("have.attr", "href")
        .and("include", "github.com");
    });

    it("shows Sign In (not Profile) without the dolthubToken cookie", () => {
      cy.get("[data-cy=navbar-signin-button]", { timeout })
        .should("be.visible")
        .and("contain.text", "Sign In")
        .and("have.attr", "href")
        .and("include", "/signin");
      cy.get("[data-cy=navbar-desktop-profile-link]").should("not.exist");
    });

    it("shows Profile (not Sign In) with the dolthubToken cookie", () => {
      cy.setCookie(dolthubTokenKey, "fake-session");
      cy.visit(page);
      cy.get("[data-cy=navbar-desktop-profile-link]", { timeout })
        .should("be.visible")
        .and("contain.text", "Profile")
        .and("have.attr", "href")
        .and("include", "/profile");
      cy.get("[data-cy=navbar-signin-button]").should("not.exist");
    });
  });

  context("mobile", () => {
    // The open menu is a full-screen overlay with aria-label "mobile nav menu";
    // scope assertions to it so they don't match the (hidden) desktop links.
    const menu = "[aria-label='mobile nav menu']";

    beforeEach(() => {
      cy.viewport(390, 844);
      cy.clearCookies();
      cy.visit(page);
    });

    it("hamburger opens the nav menu with links, and closes it", () => {
      cy.get("[aria-label='open mobile navbar menu']", { timeout }).click();
      cy.get(menu).within(() => {
        cy.get("[data-cy=mobile-navbar-products]").should("be.visible");
        cy.contains("a", "Pricing").should("be.visible");
        cy.contains("a", "Blog").should("be.visible");
        cy.contains("a", "Sign in").should("be.visible");
      });
      cy.get("[aria-label='close mobile navbar menu']").click();
      cy.get(menu).should("not.exist");
    });

    it("expands Products and Docs in the mobile menu", () => {
      cy.get("[aria-label='open mobile navbar menu']", { timeout }).click();
      cy.get(menu).within(() => {
        cy.get("[data-cy=mobile-navbar-products]").click();
        cy.get("[data-cy=nav-product-doltlite]").should("be.visible");
        cy.get("[data-cy=mobile-navbar-products]").click();
        cy.get("[data-cy=mobile-navbar-docs]").click();
        cy.get("[data-cy=nav-docs-doltlab]").should("be.visible");
      });
    });

    it("mobile menu shows Profile with the dolthubToken cookie", () => {
      cy.setCookie(dolthubTokenKey, "fake-session");
      cy.visit(page);
      cy.get("[aria-label='open mobile navbar menu']", { timeout }).click();
      cy.get(menu)
        .find("[data-cy=navbar-mobile-profile-link]")
        .should("contain.text", "Profile")
        .and("have.attr", "href")
        .and("include", "/profile");
    });

    it("Table of contents toggle opens the docs nav drawer", () => {
      cy.get(".sidebar-mobile-toggle", { timeout })
        .should("be.visible")
        .and("contain.text", "Table of contents")
        .click();
      cy.get(".sidebar-mobile").should("have.class", "sidebar-mobile-open");
    });
  });
});
