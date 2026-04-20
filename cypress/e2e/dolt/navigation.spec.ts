// Tests that the site navigation structure is intact.
export {};

const timeout = 10000;

describe("Dolt docs — navigation and structure", () => {
  context("Homepage", () => {
    it("homepage loads and has content", () => {
      cy.visit("/");
      cy.get("h1", { timeout }).should("be.visible");
      cy.get("body").invoke("text").should("have.length.above", 200);
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

  // Legacy redirects from the GitBook site. These are not yet implemented
  // on the new Astro site — uncomment and add Astro redirect config as needed.
  // context("Redirects", () => {
  //   const redirects = [
  //     { from: "/tutorials/installation", description: "→ /introduction/installation" },
  //     { from: "/reference/sql/configuration", description: "→ /sql-reference/server/configuration" },
  //   ];
  //   redirects.forEach(({ from, description }) => {
  //     it(`redirect works: ${description}`, () => {
  //       cy.request({ url: from, failOnStatusCode: false }).then(response => {
  //         expect(response.status).to.eq(200);
  //       });
  //     });
  //   });
  // });
});
