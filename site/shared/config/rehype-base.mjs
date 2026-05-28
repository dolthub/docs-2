// Rehype plugin: prefix the configured `base` onto root-absolute links and
// images in rendered markdown. Astro rebases its own page routes but not
// hardcoded `/foo` hrefs in content, which would 404 under a base path.
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
