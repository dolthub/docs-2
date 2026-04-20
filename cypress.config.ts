import { defineConfig } from "cypress";

// Dolt docs: runs against the local Astro site by default.
// To test the live GitBook site: npx cypress run --config baseUrl=https://docs.dolthub.com
export default defineConfig({
  video: false,
  e2e: {
    baseUrl: "http://localhost:4321",
    specPattern: "cypress/e2e/dolt/**/*.spec.ts",
  },
  viewportWidth: 1440,
  viewportHeight: 900,
});
