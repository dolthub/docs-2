import { defineConfig } from "cypress";

// DoltLab docs: https://docs.doltlab.com
export default defineConfig({
  video: false,
  e2e: {
    baseUrl: "https://docs.doltlab.com",
    specPattern: "cypress/e2e/doltlab/**/*.spec.ts",
  },
  viewportWidth: 1440,
  viewportHeight: 900,
});
