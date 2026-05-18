// Rehype plugin: prefix the configured `base` path onto root-absolute
// links and image sources inside rendered markdown.
//
// Astro only rewrites its own emitted page routes for `base`; it does NOT
// touch hardcoded `/foo` hrefs in markdown content. Without this, every
// in-content link like `](/sql-reference/x)` 404s once the site is served
// under a base path (e.g. dolthub.com/docs).
//
// Skips: external (http(s):), protocol-relative (//), anchors (#),
// mailto:, relative paths (./ ../), and links already under the base.
// Dependency-free so it behaves identically across all three sites
// regardless of each site's node_modules.

export default function rehypeBasePath(options = {}) {
  const base = String(options.base || "").replace(/\/+$/, "");
  if (!base) return () => {};

  function rebase(value) {
    if (typeof value !== "string") return value;
    if (!value.startsWith("/")) return value; // relative, anchor, mailto, scheme
    if (value.startsWith("//")) return value; // protocol-relative
    if (value === base || value.startsWith(base + "/")) return value; // already based
    return base + value;
  }

  function walk(node) {
    if (node.type === "element" && node.properties) {
      if (node.tagName === "a") {
        node.properties.href = rebase(node.properties.href);
      } else if (node.tagName === "img") {
        node.properties.src = rebase(node.properties.src);
      }
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) walk(child);
    }
  }

  return tree => walk(tree);
}
