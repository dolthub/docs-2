// Shared Astro config: a per-site factory (buildAstroConfig) plus its pieces.
// Workspaces hoist deps to the root, so this file can import the plugins
// directly (resolution walks up from shared/ to the hoisted root).
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeBasePath from "./rehype-base.mjs";
import remarkInjectTitleH1 from "./remark-inject-title-h1.mjs";
import remarkHeadingId from "remark-heading-id";

export const autolinkHeadingsOptions = {
  behavior: "append",
  properties: {
    class: "anchor-link",
    "aria-label": "Link to heading",
  },
  content: { type: "text", value: "#" },
};

export const shikiConfig = {
  theme: "github-dark",
  wrap: true,
};

// Per-site Vite config; siteDir is the absolute site path.
export function buildViteConfig(siteDir) {
  return {
    server: {
      // shared/ and (under workspaces) the repo-root node_modules sit outside
      // each site's root, so allow both — else astro dev blocks @astrojs/react's
      // client runtime ("outside of Vite serving allow list").
      fs: { allow: [siteDir, siteDir + "/../shared", siteDir + "/../.."] },
    },
    ssr: {
      noExternal: ["@dolthub/react-components"],
    },
    // dedupe guards against a second React copy creeping in.
    resolve: { dedupe: ["react", "react-dom"] },
  };
}

// A site's full Astro config; sites differ only by `site` and `siteDir`.
// outDir nests under `base` because Astro's `base` rewrites URLs but not the
// output layout, and Cloudflare serves the build dir at the project root.
export function buildAstroConfig(site, siteDir) {
  const base = "/docs";
  return defineConfig({
    site,
    base,
    outDir: `./dist${base}`,
    integrations: [tailwind(), react()],
    markdown: {
      shikiConfig,
      processor: unified({
        remarkPlugins: [remarkInjectTitleH1, remarkHeadingId],
        rehypePlugins: [
          [rehypeBasePath, { base }],
          rehypeSlug,
          [rehypeAutolinkHeadings, autolinkHeadingsOptions],
        ],
      }),
    },
    vite: buildViteConfig(siteDir),
  });
}
