// Regression: the search modal must render its search box on EVERY open, not
// just the first. The modal subtree unmounts on close, which destroys the
// Pagefind-injected DOM; before the fix an `initialized` ref stayed true
// after close, so reopening left the modal empty (no search box).
//
// Repro: open search -> click away without searching -> open search again.
export {};

const timeout = 15000;

describe("Dolt docs — search modal reopen", () => {
  beforeEach(() => {
    cy.visit("/introduction/what-is-dolt");
  });

  function openSearchAndAssertInput() {
    cy.get(".search-trigger", { timeout }).should("be.visible").click();
    // Pagefind UI loads async; the component polls briefly before injecting
    // its search input into the modal container.
    cy.get(".search-container input", { timeout }).should("be.visible");
  }

  it("shows the search box again after opening, clicking away, and reopening", () => {
    // 1. First open — search box present
    openSearchAndAssertInput();

    // 2. Click away on the overlay backdrop (outside the modal) to close
    cy.get(".search-overlay").click("topLeft");
    cy.get(".search-container").should("not.exist");

    // 3. Reopen — search box must be present again (was empty before the fix)
    openSearchAndAssertInput();
  });
});
