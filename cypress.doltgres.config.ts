import { defineConfig } from "cypress";

// Doltgres docs: runs against local Astro site by default. The Astro build is
// served under a base path, so `basePath` is prefixed onto request/visit URLs
// by cypress/support/e2e.ts.
// To test the live GitBook site (served at the domain root):
//   npx cypress run --config-file cypress.doltgres.config.ts --config baseUrl=https://docs.doltgres.com --env basePath=
export default defineConfig({
  video: false,
  e2e: {
    baseUrl: "http://localhost:4323",
    specPattern: "cypress/e2e/doltgres/**/*.spec.ts",
  },
  env: { basePath: "/docs" },
  viewportWidth: 1440,
  viewportHeight: 900,
});
