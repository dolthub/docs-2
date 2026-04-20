// Verifies every page in the DoltLab docs returns HTTP 200.

import {
  DocPage,
  introductionPages,
  enterprisePages,
  guidesPages,
  featuresPages,
  referencePages,
  releaseNotePages,
  olderVersionsPages,
} from "../../fixtures/doltlab-pages";

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

describe("DoltLab docs — all pages exist (HTTP 200)", () => {
  context("Introduction", () => {
    it("all introduction pages exist", () => {
      checkPagesExist(introductionPages);
    });
  });

  context("Enterprise", () => {
    it("all enterprise pages exist", () => {
      checkPagesExist(enterprisePages);
    });
  });

  context("Guides", () => {
    it("all guides pages exist", () => {
      checkPagesExist(guidesPages);
    });
  });

  context("Features", () => {
    it("all features pages exist", () => {
      checkPagesExist(featuresPages);
    });
  });

  context("Reference", () => {
    it("all reference pages exist", () => {
      checkPagesExist(referencePages);
    });
  });

  context("Release Notes", () => {
    // Release notes are many small pages — check them all for existence.
    // Batched into groups to keep individual test duration reasonable.
    it("v2.3–v2.5 release notes exist", () => {
      checkPagesExist(
        releaseNotePages.filter(p =>
          ["/v2.3", "/v2.4", "/v2.5"].some(prefix =>
            p.path.includes(prefix),
          ),
        ),
      );
    });

    it("v2.0–v2.2 release notes exist", () => {
      checkPagesExist(
        releaseNotePages.filter(p =>
          ["/v2.0", "/v2.1", "/v2.2"].some(prefix =>
            p.path.includes(prefix),
          ),
        ),
      );
    });
  });

  context("Older Versions", () => {
    it("all older-version pages exist", () => {
      checkPagesExist(olderVersionsPages);
    });
  });
});
