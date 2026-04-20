// Verifies every page in the Doltgres docs returns HTTP 200.

import {
  DocPage,
  introductionPages,
  conceptsPages,
  guidesPages,
  referencePages,
} from "../../fixtures/doltgres-pages";

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

describe("Doltgres docs — all pages exist (HTTP 200)", () => {
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

  context("Guides", () => {
    it("all guides pages exist", () => {
      checkPagesExist(guidesPages);
    });
  });

  context("Reference", () => {
    it("all reference pages exist", () => {
      checkPagesExist(referencePages);
    });
  });
});
