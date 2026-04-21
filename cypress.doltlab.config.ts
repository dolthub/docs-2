import { defineConfig } from "cypress";

// DoltLab docs: runs against local Astro site by default.
// To test the live GitBook site: npx cypress run --config-file cypress.doltlab.config.ts --config baseUrl=https://docs.doltlab.com
export default defineConfig({
  video: false,
  e2e: {
    baseUrl: "http://localhost:4322",
    specPattern: "cypress/e2e/doltlab/**/*.spec.ts",
  },
  viewportWidth: 1440,
  viewportHeight: 900,
});
