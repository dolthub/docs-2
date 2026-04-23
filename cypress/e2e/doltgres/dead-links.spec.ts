// Crawls every page in the Doltgres docs and verifies that all internal links
// resolve to a real page (HTTP 200).
export {};

import { allDoltgresPages } from "../../fixtures/doltgres-pages";

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

const batchSize = 10;
const batches: Array<{ name: string; pages: typeof allDoltgresPages }> = [];
for (let i = 0; i < allDoltgresPages.length; i += batchSize) {
  const batch = allDoltgresPages.slice(i, i + batchSize);
  const first = batch[0].path;
  const last = batch[batch.length - 1].path;
  batches.push({ name: `${first} ... ${last}`, pages: batch });
}

describe("Doltgres docs — dead link check", () => {
  batches.forEach(({ name, pages }) => {
    it(`no dead links in batch: ${name}`, () => {
      const deadLinks: string[] = [];

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
});
