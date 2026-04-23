// Verifies every page has exactly one h1 heading (the page title).
// Multiple h1s break semantic HTML and confuse the table of contents.
export {};

import { allDoltPages } from "../../fixtures/dolt-pages";

const timeout = 10000;

const batchSize = 15;
const batches: Array<{ name: string; pages: typeof allDoltPages }> = [];
for (let i = 0; i < allDoltPages.length; i += batchSize) {
  const batch = allDoltPages.slice(i, i + batchSize);
  batches.push({
    name: `${batch[0].path} ... ${batch[batch.length - 1].path}`,
    pages: batch,
  });
}

describe("Dolt docs — single h1 per page", () => {
  batches.forEach(({ name, pages }) => {
    it(`only one h1 in batch: ${name}`, () => {
      const violations: string[] = [];

      cy.wrap(pages).each((page: any) => {
        cy.visit(page.path, { failOnStatusCode: false });
        cy.get("body", { timeout }).should("exist");

        cy.get(".docs-article h1").then($h1s => {
          if ($h1s.length !== 1) {
            const headings = Array.from($h1s).map(
              el => el.textContent?.replace(/#$/, "").trim() || "",
            );
            violations.push(
              `${page.path} has ${$h1s.length} h1s${headings.length ? `: ${headings.join(", ")}` : ""}`,
            );
          }
        });
      }).then(() => {
        if (violations.length > 0) {
          throw new Error(
            `Found ${violations.length} page(s) that do not have exactly one h1:\n${violations.join("\n")}`,
          );
        }
      });
    });
  });
});
