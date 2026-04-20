import { defineConfig } from "cypress";

// Dolt docs: https://docs.dolthub.com
export default defineConfig({
  video: false,
  e2e: {
    baseUrl: "https://docs.dolthub.com",
    specPattern: "cypress/e2e/dolt/**/*.spec.ts",
  },
  viewportWidth: 1440,
  viewportHeight: 900,
});
