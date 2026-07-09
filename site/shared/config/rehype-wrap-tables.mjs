// Rehype plugin: wrap every rendered `<table>` in a scrollable `<div>`. Wide
// tables (many columns, or long unbroken `<code>` cells) can be wider than
// the content column, especially on mobile; without a wrapper the overflow
// pushes the whole page wider instead of scrolling in place.
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
