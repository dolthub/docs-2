// Tests for the shared site navbar: links, the Documentation dropdown, the
// cookie-driven Sign In / Profile button, and the mobile menu. The navbar is a
// client-only React island, so the first assertion in each test uses `timeout`
// to allow for hydration. Cypress's default viewport (1000px) is below the
// `lg` breakpoint, so desktop/mobile viewports are set explicitly.
export {};

const timeout = 10000;
const page = "/introduction/what-is-dolt";
const dolthubTokenKey = "dolthubToken";

describe("Dolt docs — navbar", () => {
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

    it("left links point to DoltHub", () => {
      cy.get("[data-cy=navbar-databases]", { timeout })
        .should("be.visible")
        .and("contain.text", "DoltHub")
        .and("have.attr", "href")
        .and("include", "/discover");
      cy.get("[data-cy=navbar-pricing]")
        .should("have.attr", "href")
        .and("include", "/pricing");
      cy.get("[data-cy=navbar-blog]")
        .should("have.attr", "href")
        .and("include", "/blog");
    });

    it("Documentation dropdown opens the three product docs links", () => {
      cy.get("[data-cy=navbar-documentation]", { timeout }).click();
      cy.get(".docs-dropdown-menu").should("be.visible");
      ["Dolt", "DoltLab", "Doltgres"].forEach(name => {
        cy.get(".docs-dropdown-menu")
          .contains("a", name)
          .should("have.attr", "href");
      });
    });

    it("has Discord and GitHub links; GitHub shows a star count", () => {
      cy.get("a[href*='discord.gg']", { timeout }).should("exist");
      // The GitHub button links to the repo and renders its star count (a
      // fallback shows immediately, so a digit is present even if the API call
      // is slow/rate-limited).
      cy.get("a[href*='github.com/dolthub/dolt']", { timeout })
        .should("exist")
        .invoke("text")
        .should("match", /\d/);
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
        cy.contains("a", "DoltHub").should("be.visible");
        cy.contains("a", "Pricing").should("be.visible");
        cy.contains("a", "Blog").should("be.visible");
        cy.contains("a", "Sign In").should("be.visible");
      });
      cy.get("[aria-label='close mobile navbar menu']").click();
      cy.get(menu).should("not.exist");
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
