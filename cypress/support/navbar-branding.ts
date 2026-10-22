// Shared branding and breakpoint checks for the three docs builds.
export function navbarBranding(product: string, page: string) {
  describe(`${product} navbar branding and layout`, () => {
    [1280, 1024, 768, 390, 320].forEach((width) => {
      it(`uses the ${product} logo and fits at ${width}px`, () => {
        cy.intercept("https://api.github.com/repos/dolthub/dolt", {
          stargazers_count: 16000,
        });
        cy.viewport(width, 900);
        cy.visit(page);
        cy.get("[data-cy=navbar-logo]", { timeout: 10000 })
          .filter(":visible")
          .find("img")
          .should("have.attr", "alt", product)
          .and("be.visible")
          .should(($img) => {
            expect(
              ($img[0] as HTMLImageElement).naturalWidth,
            ).to.be.greaterThan(0);
          });
        cy.get(".navbar-slot").should(($nav) => {
          expect($nav[0].scrollWidth).to.be.at.most(width);
        });
        if (width >= 1024) {
          cy.get("[data-cy=navbar-signin-button]")
            .should("be.visible")
            .should(($link) => {
              expect($link[0].getBoundingClientRect().right).to.be.at.most(
                width,
              );
            });
          cy.get("[data-cy=navbar-products]").click();
          cy.get(".docs-navbar-products")
            .should("be.visible")
            .should(($panel) => {
              expect($panel[0].scrollWidth).to.be.at.most(width);
            });
        } else {
          cy.get("[aria-label='open mobile navbar menu']").click();
          cy.get("[data-cy=mobile-navbar-products]").click();
          cy.get("[aria-label='mobile nav menu']").should(($menu) => {
            expect($menu[0].scrollWidth).to.be.at.most(width);
          });
        }
        if (Cypress.expose("navbarScreenshots")) {
          cy.screenshot(`${product}-navbar-${width}`, { capture: "viewport" });
        }
      });
    });
  });
}
