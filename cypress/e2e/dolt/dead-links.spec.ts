// Crawls every page in the Dolt docs and verifies that all internal links
// resolve to a real page (HTTP 200). Reports all dead links found.
export {};

import { allDoltPages } from "../../fixtures/dolt-pages";

const timeout = 10000;

function isInternalPageLink(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("http://") || href.startsWith("https://")) return false;
  if (href.startsWith("mailto:")) return false;
  if (href.startsWith("#")) return false;
  if (href.includes(".gitbook/assets")) return false;
  if (/\.(png|jpg|jpeg|gif|svg|webp|pdf|json|sh)$/i.test(href)) return false;
  return true;
}

// Batch pages into groups to keep individual test duration reasonable
const batchSize = 10;
const batches: Array<{ name: string; pages: typeof allDoltPages }> = [];
for (let i = 0; i < allDoltPages.length; i += batchSize) {
  const batch = allDoltPages.slice(i, i + batchSize);
  const first = batch[0].path;
  const last = batch[batch.length - 1].path;
  batches.push({
    name: `${first} ... ${last}`,
    pages: batch,
  });
}

describe("Dolt docs — dead link check (all pages)", () => {
  batches.forEach(({ name, pages }) => {
    it(`no dead links in batch: ${name}`, () => {
      const deadLinks: string[] = [];

      // Use cy.wrap to chain async checks sequentially
      cy.wrap(pages).each((page: any) => {
        const pagePath = page.path;
        cy.visit(pagePath, { failOnStatusCode: false });
        cy.get("body", { timeout }).should("exist");

        cy.get(".docs-article a[href]").then($links => {
          const urls = new Set<string>();
          $links.each((_i, el) => {
            const href = el.getAttribute("href") || "";
            if (!isInternalPageLink(href)) return;
            const anchor = el as HTMLAnchorElement;
            if (anchor.pathname) urls.add(anchor.pathname);
          });

          urls.forEach(pathname => {
            cy.request({ url: pathname, failOnStatusCode: false }).then(
              resp => {
                if (resp.status !== 200) {
                  deadLinks.push(`${pagePath} → ${pathname} (${resp.status})`);
                }
              },
            );
          });
        });
      }).then(() => {
        if (deadLinks.length > 0) {
          throw new Error(
            `Found ${deadLinks.length} dead link(s):\n${deadLinks.join("\n")}`,
          );
        }
      });
    });
  });

  it("no links contain .md extension", () => {
    // Check all pages for leftover .md extensions
    cy.wrap(allDoltPages).each((page: any) => {
      cy.visit(page.path, { failOnStatusCode: false });
      cy.get(".docs-article a[href]").each($el => {
        const href = $el.attr("href") || "";
        if (isInternalPageLink(href)) {
          expect(
            href,
            `Link on ${page.path} should not contain .md`,
          ).to.not.match(/\.md(#|$)/);
        }
      });
    });
  });
});
