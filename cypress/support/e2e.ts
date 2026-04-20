import "./commands";

// Suppress uncaught JS exceptions from the application under test.
// GitBook and similar doc frameworks load analytics/cookie scripts that often
// throw in Cypress's sandboxed environment. These are not meaningful signals
// for migration testing — we care about content, not third-party scripts.
Cypress.on("uncaught:exception", () => false);
