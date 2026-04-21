import { defineConfig } from "cypress";

// Doltgres docs: runs against local Astro site by default.
// To test the live GitBook site: npx cypress run --config-file cypress.doltgres.config.ts --config baseUrl=https://docs.doltgres.com
export default defineConfig({
  video: false,
  e2e: {
    baseUrl: "http://localhost:4323",
    specPattern: "cypress/e2e/doltgres/**/*.spec.ts",
  },
  viewportWidth: 1440,
  viewportHeight: 900,
});
