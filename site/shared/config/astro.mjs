// Shared Astro configuration. Exports a per-site config factory
// (buildAstroConfig) plus the pieces it composes. Under npm workspaces all
// dependencies hoist to the repo-root node_modules, so this shared file can
// import the integrations/plugins directly — Node resolution walks up from
// shared/ to the hoisted root.
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeBasePath from "./rehype-base.mjs";
import remarkInjectTitleH1 from "./remark-inject-title-h1.mjs";

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

// Build the vite config per-site. `siteDir` is the absolute path to the site
// directory (e.g. site/dolt/), needed so Vite resolves shared component deps
// from the site's own node_modules.
export function buildViteConfig(siteDir) {
  return {
    server: {
      fs: {
        // Allow serving files from shared/ which is outside each site's root
        allow: [siteDir, siteDir + "/../shared"],
      },
    },
    ssr: {
      noExternal: ["@dolthub/react-components"],
    },
    resolve: {
      // With npm workspaces, react/react-dom and the @dolthub packages hoist
      // to the repo-root node_modules, so a single copy is resolved for every
      // site (and for shared/, which has no node_modules of its own). `dedupe`
      // guards against a second React copy sneaking in. The old per-site path
      // aliases are no longer needed now that resolution walks up to the
      // hoisted root.
      dedupe: ["react", "react-dom"],
    },
  };
}

// Build a site's full Astro config. The three docs sites are identical except
// for `site` (their canonical origin) and `siteDir` (used for Vite fs.allow),
// so each site's astro.config.mjs is a one-line call into this factory.
//
// Astro's `base` only rewrites URLs, not the on-disk output layout, and
// Cloudflare Pages serves the build dir at the project root. Nesting outDir
// under the base segment makes `dist/docs/_astro/*` line up with the
// `/docs/_astro/*` asset URLs in the HTML.
export function buildAstroConfig(site, siteDir) {
  const base = "/docs";
  return defineConfig({
    site,
    base,
    outDir: `./dist${base}`,
    integrations: [tailwind(), react()],
    markdown: {
      shikiConfig,
      remarkPlugins: [remarkInjectTitleH1],
      rehypePlugins: [
        [rehypeBasePath, { base }],
        rehypeSlug,
        [rehypeAutolinkHeadings, autolinkHeadingsOptions],
      ],
    },
    vite: buildViteConfig(siteDir),
  });
}
