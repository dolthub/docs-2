// Custom commands for docs migration tests.
// The `export {}` makes this a module so that the `declare global` augmentation
// is allowed by TypeScript.
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /** Asserts that path returns HTTP 200. */
      assertPageExists(path: string): void;
      /** Visits path and asserts h1 contains expectedTitle. */
      assertH1(
        path: string,
        expectedTitle: string,
        options?: { exact?: boolean },
      ): void;
    }
  }
}

Cypress.Commands.add("assertPageExists", (path: string) => {
  cy.request({ url: path, failOnStatusCode: false }).then(response => {
    expect(response.status, `${path} should return 200`).to.eq(200);
  });
});

Cypress.Commands.add(
  "assertH1",
  (path: string, expectedTitle: string, options?: { exact?: boolean }) => {
    cy.visit(path);
    if (options?.exact) {
      cy.get("h1").should("be.visible").and("have.text", expectedTitle);
    } else {
      cy.get("h1").should("be.visible").and("contain", expectedTitle);
    }
  },
);
