// Remark plugin: inject the frontmatter `title` as the page's H1.
//
// Docs pages render their `title` as both the browser <title> (via the
// page wrapper) and an on-page H1. Rather than repeat the title as a
// manual `# Heading` in every Markdown file, this plugin prepends an H1
// built from `frontmatter.title`.
//
// It only injects when the document has no H1 of its own, so a page that
// intentionally provides a different H1 (e.g. a "Table of Contents"
// heading, or a more descriptive title) keeps its own heading and does
// not get a duplicate. Pages whose H1 just repeated the title have that
// H1 removed from source, so this plugin supplies it instead.
export default function remarkInjectTitleH1() {
  return (tree, file) => {
    const title = file?.data?.astro?.frontmatter?.title;
    if (!title) return;

    const hasH1 = tree.children.some(
      node => node.type === "heading" && node.depth === 1,
    );
    if (hasH1) return; // page already has an H1 — don't add a second one

    tree.children.unshift({
      type: "heading",
      depth: 1,
      children: [{ type: "text", value: String(title) }],
    });
  };
}
