// Rehype plugin: wrap every rendered `<table>` in a scrollable `<div>`. Tables
// with long unbroken `<code>` cells (endpoint paths, etc.) can overflow the
// content column; without a wrapper the overflow just clips at the viewport
// edge instead of scrolling.
export default function rehypeWrapTables() {
  function wrap(node) {
    if (node.type === "element" && node.tagName === "table") {
      return {
        type: "element",
        tagName: "div",
        properties: { className: ["table-scroll"] },
        children: [node],
      };
    }
    return node;
  }

  function walk(node) {
    if (!Array.isArray(node.children)) return;
    node.children = node.children.map(child => {
      walk(child);
      return wrap(child);
    });
  }

  return tree => walk(tree);
}
