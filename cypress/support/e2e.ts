import "./commands";
import { withBase } from "./with-base";

// Make the whole suite base-path aware without touching individual specs.
// Every cy.visit / cy.request that targets a root-relative path gets the
// configured `basePath` (e.g. "/docs") prefixed. withBase is idempotent, so
// already-based rendered-link pathnames and live runs (basePath unset) are
// unaffected. Custom commands (assertPageExists/assertH1) route through these
// too, so they inherit the behavior automatically.
Cypress.Commands.overwrite("visit", ((originalFn: any, ...args: any[]) => {
  if (typeof args[0] === "string") {
    args[0] = withBase(args[0]);
  } else if (args[0] && typeof args[0] === "object" && typeof args[0].url === "string") {
    args[0] = { ...args[0], url: withBase(args[0].url) };
  }
  return originalFn(...args);
}) as any);

Cypress.Commands.overwrite("request", ((originalFn: any, ...args: any[]) => {
  if (args[0] && typeof args[0] === "object" && typeof args[0].url === "string") {
    args[0] = { ...args[0], url: withBase(args[0].url) };
  } else if (typeof args[0] === "string" && args[0].startsWith("/")) {
    // cy.request(url, ...)
    args[0] = withBase(args[0]);
  } else if (typeof args[0] === "string" && typeof args[1] === "string") {
    // cy.request(method, url, ...)
    args[1] = withBase(args[1]);
  }
  return originalFn(...args);
}) as any);

// Suppress uncaught JS exceptions from the application under test.
// GitBook and similar doc frameworks load analytics/cookie scripts that often
// throw in Cypress's sandboxed environment. These are not meaningful signals
// for migration testing — we care about content, not third-party scripts.
Cypress.on("uncaught:exception", () => false);
