// Verifies that internal links on docs pages actually resolve.
// Catches .md extensions that weren't stripped, broken relative paths,
// and missing URL remappings (e.g. reference/sql → sql-reference).
export {};

const timeout = 10000;

// Pages with many internal links — one per major section
const pagesToCrawl = [
  "/introduction/what-is-dolt",
  "/introduction/installation",
  "/introduction/getting-started",
  "/introduction/use-cases",
  "/concepts/dolt",
  "/concepts/dolt/git",
  "/concepts/dolt/sql",
  "/concepts/dolthub",
  "/sql-reference/server",
  "/sql-reference/version-control",
  "/sql-reference/sql-support",
  "/cli-reference/cli",
  "/architecture/architecture",
  "/architecture/storage-engine",
  "/guides/cheat-sheet",
  "/guides/contributing",
  "/products/hosted",
  "/products/dolthub",
  "/products/dolthub/api",
  "/other/faq",
];

function isInternalPageLink(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("http://") || href.startsWith("https://")) return false;
  if (href.startsWith("mailto:")) return false;
  if (href.startsWith("#")) return false;
  // Skip image/asset links
  if (href.includes(".gitbook/assets")) return false;
  if (/\.(png|jpg|jpeg|gif|svg|webp|pdf)$/i.test(href)) return false;
  return true;
}

describe("Dolt docs — internal links resolve", () => {
  pagesToCrawl.forEach(page => {
    it(`all internal links on ${page} resolve`, () => {
      cy.visit(page);
      cy.get(".docs-article", { timeout }).should("exist");

      // Collect hrefs, then resolve them by getting the actual absolute URL
      // from the browser (which handles relative path resolution correctly)
      cy.get(".docs-article a[href]").then($links => {
          // Get unique absolute URLs from internal links
          const urls = new Set<string>();
          $links.each((_i, el) => {
            const href = el.getAttribute("href") || "";
            if (!isInternalPageLink(href)) return;
            const anchor = el as HTMLAnchorElement;
            const pathname = anchor.pathname;
            if (pathname) urls.add(pathname);
          });

          urls.forEach(pathname => {
            cy.request({ url: pathname, failOnStatusCode: false }).then(
              resp => {
                expect(
                  resp.status,
                  `Link to "${pathname}" on ${page} should return 200`,
                ).to.eq(200);
              },
            );
          });
        });
    });
  });

  it("no links contain .md extension", () => {
    const pages = [
      "/products/hosted",
      "/sql-reference/server",
      "/concepts/dolt",
    ];

    pages.forEach(page => {
      cy.visit(page);
      cy.get(".docs-article a[href]").each($el => {
        const href = $el.attr("href") || "";
        if (isInternalPageLink(href)) {
          expect(href, `Link on ${page} should not end in .md`).to.not.match(
            /\.md(#|$)/,
          );
        }
      });
    });
  });
});
