import { defineConfig } from "cypress";

// DoltLab docs: runs against local Astro site by default. The Astro build is
// served under a base path, so `basePath` is prefixed onto request/visit URLs
// by cypress/support/e2e.ts.
// To test the live GitBook site (served at the domain root):
//   npx cypress run --config-file cypress.doltlab.config.ts --config baseUrl=https://docs.doltlab.com --env basePath=
export default defineConfig({
  video: false,
  e2e: {
    baseUrl: "http://localhost:4322",
    specPattern: "cypress/e2e/doltlab/**/*.spec.ts",
  },
  env: { basePath: "/docs" },
  viewportWidth: 1440,
  viewportHeight: 900,
});
