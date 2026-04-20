import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { fileURLToPath } from "url";
import path from "path";
import {
  autolinkHeadingsOptions,
  shikiConfig,
  buildViteConfig,
} from "../shared/config/astro.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: "https://docs.doltgres.com",
  integrations: [tailwind(), react()],
  markdown: {
    shikiConfig,
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, autolinkHeadingsOptions],
    ],
  },
  vite: buildViteConfig(__dirname),
});
