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
  const nodeModules = siteDir + "/node_modules";
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
      dedupe: ["react", "react-dom"],
      alias: {
        // Ensure imports from shared/ resolve deps from the site's node_modules
        "@dolthub/react-components": nodeModules + "/@dolthub/react-components",
        "@dolthub/react-hooks": nodeModules + "/@dolthub/react-hooks",
        "@react-icons/all-files": nodeModules + "/@react-icons/all-files",
      },
    },
  };
}
