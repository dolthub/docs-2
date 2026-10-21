import { withBase } from "../../support/with-base";

describe("Docs base path", () => {
  it("prefixes root-relative paths", { expose: { basePath: "/docs" } }, () => {
    expect(withBase("/introduction/what-is-dolt")).to.eq(
      "/docs/introduction/what-is-dolt",
    );
    expect(withBase("/")).to.eq("/docs/");
  });

  it("preserves already-prefixed and absolute URLs", { expose: { basePath: "/docs" } }, () => {
    expect(withBase("/docs")).to.eq("/docs");
    expect(withBase("/docs/introduction/what-is-dolt")).to.eq(
      "/docs/introduction/what-is-dolt",
    );
    expect(withBase("https://docs.dolthub.com/")).to.eq("https://docs.dolthub.com/");
    expect(withBase("/docs-extra")).to.eq("/docs/docs-extra");
  });

  it("normalizes trailing slashes", { expose: { basePath: "/docs/" } }, () => {
    expect(withBase("/introduction/what-is-dolt")).to.eq(
      "/docs/introduction/what-is-dolt",
    );
  });

  it("supports live runs without a base path", { expose: { basePath: "" } }, () => {
    expect(withBase("/introduction/what-is-dolt")).to.eq("/introduction/what-is-dolt");
    expect(withBase("/")).to.eq("/");
  });
});
