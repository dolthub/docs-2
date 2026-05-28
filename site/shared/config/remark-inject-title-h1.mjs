// Remark plugin: prepend the frontmatter `title` as the page's H1, unless the
// page already has its own H1 (so a deliberately different heading is kept and
// not duplicated).
export default function remarkInjectTitleH1() {
  return (tree, file) => {
    const title = file?.data?.astro?.frontmatter?.title;
    if (!title) return;

    const hasH1 = tree.children.some(
      node => node.type === "heading" && node.depth === 1,
    );
    if (hasH1) return;

    tree.children.unshift({
      type: "heading",
      depth: 1,
      children: [{ type: "text", value: String(title) }],
    });
  };
}
