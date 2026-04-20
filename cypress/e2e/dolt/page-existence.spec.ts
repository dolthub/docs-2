// Verifies every page in the Dolt docs returns HTTP 200.
// Run this against the current GitBook site to establish a baseline, then
// run it again against the new site after migration to catch any missing pages.
//
// Uses cy.request() rather than cy.visit() so the suite runs fast (~300ms/page).

import {
  DocPage,
  introductionPages,
  conceptsPages,
  sqlReferencePages,
  cliReferencePages,
  architecturePages,
  guidesPages,
  otherPages,
  productsPages,
} from "../../fixtures/dolt-pages";

function checkPagesExist(pages: DocPage[]) {
  pages.forEach(({ path, title }) => {
    cy.request({ url: path, failOnStatusCode: false }).then(response => {
      expect(
        response.status,
        `"${title}" at ${path} should return 200`,
      ).to.eq(200);
    });
  });
}

describe("Dolt docs — all pages exist (HTTP 200)", () => {
  context("Introduction", () => {
    it("all introduction pages exist", () => {
      checkPagesExist(introductionPages);
    });
  });

  context("Concepts", () => {
    it("all concepts pages exist", () => {
      checkPagesExist(conceptsPages);
    });
  });

  context("SQL Reference", () => {
    it("all SQL reference pages exist", () => {
      checkPagesExist(sqlReferencePages);
    });
  });

  context("CLI Reference", () => {
    it("all CLI reference pages exist", () => {
      checkPagesExist(cliReferencePages);
    });
  });

  context("Architecture", () => {
    it("all architecture pages exist", () => {
      checkPagesExist(architecturePages);
    });
  });

  context("Guides", () => {
    it("all guides pages exist", () => {
      checkPagesExist(guidesPages);
    });
  });

  context("Other", () => {
    it("all other pages exist", () => {
      checkPagesExist(otherPages);
    });
  });

  context("Products", () => {
    it("all products pages exist", () => {
      checkPagesExist(productsPages);
    });
  });
});
