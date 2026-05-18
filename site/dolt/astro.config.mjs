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
import rehypeBasePath from "../shared/config/rehype-base.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = "/docs";

export default defineConfig({
  site: "https://dolthub.com",
  base,
  integrations: [tailwind(), react()],
  markdown: {
    shikiConfig,
    rehypePlugins: [
      [rehypeBasePath, { base }],
      rehypeSlug,
      [rehypeAutolinkHeadings, autolinkHeadingsOptions],
    ],
  },
  vite: buildViteConfig(__dirname),
});
