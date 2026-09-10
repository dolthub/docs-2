export {};

const reference = "/products/dolthub/cli/commands";

describe("DoltHub CLI consolidated reference", () => {
  it("renders each command once, with working index links and one sidebar entry", () => {
    cy.request(`${reference}.md`).then(({ body }) => {
      const anchors = [...String(body).matchAll(/^## dh(?: [a-z-]+)* \{#([^}]+)\}/gm)].map(match => match[1]);
      expect(anchors.length).to.be.greaterThan(30);
      cy.visit(reference);
      cy.get("h1").should("have.length", 1).and("contain", "DoltHub CLI command reference");
      for (const anchor of anchors) {
        cy.get(`.docs-article h2[id="${anchor}"]`).should("have.length", 1);
      }
      cy.get(`.sidebar-desktop a[href$="${reference}"]`).should("have.length", 1);
      cy.get(`.sidebar-desktop a[href*="${reference}/"]`).should("not.exist");
      cy.get('.docs-article a[href$="commands#dh-pr-create"]').first().click();
      cy.location("hash").should("eq", "#dh-pr-create");
      cy.get('.toc a[href="#dh-pr-create"]').should("exist");
    });
  });

  it("follows an authored guide link to its command section", () => {
    cy.visit("/products/dolthub/cli/guides/table-imports");
    cy.get('a[href$="commands#dh-table-import"]').first().click();
    cy.location("pathname").should("match", /\/cli\/commands\/?$/);
    cy.location("hash").should("eq", "#dh-table-import");
    cy.get("#dh-table-import").should("exist");
  });

  it("preserves a subcommand fragment and query through a legacy redirect", () => {
    cy.visit(`${reference}/pr?source=legacy#dh-pr-create`);
    cy.location("pathname").should("match", /\/cli\/commands\/?$/);
    cy.location("hash").should("eq", "#dh-pr-create");
    cy.location("search").should("eq", "?source=legacy");
    cy.get("#dh-pr-create").should("exist");
  });

  it("redirects a bare group URL to the reference", () => {
    cy.visit(`${reference}/auth`);
    cy.location("pathname").should("match", /\/cli\/commands\/?$/);
    cy.get("#dh-auth").should("exist");
  });

  it("lists only the consolidated reference in llms.txt", () => {
    cy.request("/llms.txt").then(({ body }) => {
      expect(body).to.include(`${reference}.md`);
      expect(body).not.to.include(`${reference}/`);
    });
  });
});
