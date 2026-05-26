// Shared Astro configuration values.
// Rehype plugins must be imported per-site since module resolution is local.
// This file exports the rehype-autolink-headings options and vite config.

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
