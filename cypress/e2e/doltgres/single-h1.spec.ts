// Verifies every Doltgres page has exactly one h1 heading.
export {};

import { allDoltgresPages } from "../../fixtures/doltgres-pages";

const timeout = 10000;

const batchSize = 15;
const batches: Array<{ name: string; pages: typeof allDoltgresPages }> = [];
for (let i = 0; i < allDoltgresPages.length; i += batchSize) {
  const batch = allDoltgresPages.slice(i, i + batchSize);
  batches.push({
    name: `${batch[0].path} ... ${batch[batch.length - 1].path}`,
    pages: batch,
  });
}

describe("Doltgres docs — single h1 per page", () => {
  batches.forEach(({ name, pages }) => {
    it(`only one h1 in batch: ${name}`, () => {
      const violations: string[] = [];

      cy.wrap(pages).each((page: any) => {
        cy.visit(page.path, { failOnStatusCode: false });
        cy.get("body", { timeout }).should("exist");

        cy.get(".docs-article h1").then($h1s => {
          if ($h1s.length > 1) {
            const headings = Array.from($h1s).map(
              el => el.textContent?.replace(/#$/, "").trim() || "",
            );
            violations.push(
              `${page.path} has ${$h1s.length} h1s: ${headings.join(", ")}`,
            );
          }
        });
      }).then(() => {
        if (violations.length > 0) {
          throw new Error(
            `Found ${violations.length} page(s) with multiple h1s:\n${violations.join("\n")}`,
          );
        }
      });
    });
  });
});
