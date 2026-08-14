// Shared PostCSS config, one per site via each site's postcss.config.mjs.
//
// This replaces @astrojs/tailwind, which was removed in the Astro 7 migration:
// its latest release (6.0.2) declares `astro: ^3 || ^4 || ^5`, so it never
// supported Astro 6 or 7 and is effectively unmaintained. Astro processes
// <style> blocks and imported CSS through PostCSS on its own, so wiring
// Tailwind here does the same job the integration did.
//
// The integration also injected the `@tailwind` directives (applyBaseStyles).
// Those now live in shared/styles/global.css, imported by DocsLayout.
//
// siteDir is the absolute site path — Tailwind's config is resolved relative
// to it so each site keeps its own content globs.
export function buildPostcssConfig(siteDir) {
  return {
    plugins: {
      tailwindcss: { config: `${siteDir}/tailwind.config.mjs` },
      autoprefixer: {},
    },
  };
}
