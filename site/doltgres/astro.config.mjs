import { defineConfig } from "astro/config";
import { baseAstroConfig } from "../shared/config/astro.mjs";

export default defineConfig({
  ...baseAstroConfig,
  site: "https://docs.doltgres.com",
});
