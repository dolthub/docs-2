import { defineConfig } from "cypress";

// Doltgres docs: https://docs.doltgres.com
export default defineConfig({
  video: false,
  e2e: {
    baseUrl: "https://docs.doltgres.com",
    specPattern: "cypress/e2e/doltgres/**/*.spec.ts",
  },
  viewportWidth: 1440,
  viewportHeight: 900,
});
