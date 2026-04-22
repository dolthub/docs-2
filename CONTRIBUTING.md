# Contributing to Docs

This guide explains how to edit existing docs pages and add new ones.

## Repository structure

```
site/
  shared/              # Shared components (Navbar, Footer, Sidebar, Search)
  dolt/                # docs.dolthub.com
  doltlab/             # docs.doltlab.com
  doltgres/            # docs.doltgres.com
```

Each site has the same structure:

```
site/<product>/
  src/
    content/           # Markdown files (the actual docs content)
    pages/             # Astro page files (thin wrappers that render content)
    layouts/           # DocsLayout.astro (shared layout with navbar/sidebar/footer)
    nav.ts             # Sidebar navigation tree
  public/              # Static assets (images, favicon)
  astro.config.mjs     # Astro config
  tailwind.config.mjs  # Tailwind config
  package.json
```

## Setup

```sh
cd site
npm run install:all    # Install dependencies for all three sites
npm run dev            # Start all three dev servers
```

Dev server ports:
- Dolt: http://localhost:4321
- DoltLab: http://localhost:4322
- Doltgres: http://localhost:4323

To run a single site:

```sh
cd site/dolt
npm run dev
```

## Editing an existing page

1. Find the markdown file in `site/<product>/src/content/`. The file path matches the URL path. For example, `/introduction/what-is-dolt` is at `src/content/introduction/what-is-dolt.md`.

2. Edit the markdown file. It uses standard markdown with:
   - Frontmatter at the top (`---` delimited) with a `title` field
   - Standard markdown headings, links, code blocks, tables, images
   - HTML is supported for things like DoltHub SQL console embeds

3. The dev server hot-reloads changes automatically.

## Adding a new page

Adding a new page requires three changes:

### 1. Create the markdown file

Create a new `.md` file in `src/content/` at the path you want. For example, to add a page at `/guides/my-new-guide`:

```md
---
title: "My New Guide"
---

# My New Guide

Your content here...
```

Every page must have:
- Frontmatter with a `title` field
- An `# h1` heading in the body

### 2. Create the Astro page file

Create a corresponding `.astro` file in `src/pages/` at the same path. For `/guides/my-new-guide`:

**`src/pages/guides/my-new-guide.astro`**:

```astro
---
import DocsLayout from "../../layouts/DocsLayout.astro";

const post = await import("../../content/guides/my-new-guide.md");
const Content = post.Content;
---

<DocsLayout title="My New Guide">
  <Content />
</DocsLayout>
```

The import path is relative from the page file to the content file. Count the directory depth to get the right number of `../` prefixes.

### 3. Add to sidebar navigation

Edit `src/nav.ts` to add your page to the sidebar. Find the appropriate section and add an entry:

```ts
{
  section: "Guides",
  items: [
    { title: "Cheat Sheet", href: "/guides/cheat-sheet" },
    { title: "My New Guide", href: "/guides/my-new-guide" },  // ← add here
  ],
},
```

For nested pages with children:

```ts
{
  title: "Parent Page",
  href: "/guides/parent",
  children: [
    { title: "Child Page", href: "/guides/parent/child" },
  ],
},
```

## Adding a section index page

For a new section like `/guides/my-section/` with child pages, create a `README.md` in a directory:

1. **Content**: `src/content/guides/my-section/README.md`
2. **Page**: `src/pages/guides/my-section.astro` (note: not `my-section/index.astro`)
3. **Child pages**: `src/content/guides/my-section/child.md` etc.

The page file for a README.md section index:

```astro
---
import DocsLayout from "../../../layouts/DocsLayout.astro";

const post = await import("../../../content/guides/my-section/README.md");
const Content = post.Content;
---

<DocsLayout title="My Section">
  <Content />
</DocsLayout>
```

## Internal links

Use absolute paths for internal links:

```md
See the [installation guide](/introduction/installation) for details.
```

Do **not** use:
- Relative paths (`./foo` or `../bar`) — these break due to URL vs filesystem path differences
- `.md` extensions (`/introduction/installation.md`) — Astro doesn't strip them

## Images

Place images in `src/content/.gitbook/assets/` (legacy path from the GitBook migration) and reference them with relative paths from the markdown file:

```md
![Screenshot](../../.gitbook/assets/my-screenshot.png)
```

## Embedding DoltHub SQL console

Use an iframe with the `dolthub-embed` class:

```html
<div class="dolthub-embed-wrapper">
  <iframe src="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=SELECT+1" class="dolthub-embed" loading="lazy"></iframe>
  <a href="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=SELECT+1" class="dolthub-embed-fallback" target="_blank">Open in DoltHub SQL console &#x2197;</a>
</div>
```

## Embedding YouTube videos

Use an iframe with the `youtube-embed` class:

```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID" class="youtube-embed" allowfullscreen></iframe>
```

## API docs (DoltHub API only)

The DoltHub API documentation is generated from OpenAPI spec files by `scripts/generate-api-docs.py`. To update API docs:

1. Edit the OpenAPI spec JSON files in the [dolthub/docs](https://github.com/dolthub/docs) repo at `packages/dolt/content/.gitbook/assets/dolthub-api/`
2. Run `python3 scripts/generate-api-docs.py`

## Re-importing from dolthub/docs

If the source markdown in [dolthub/docs](https://github.com/dolthub/docs) has been updated, re-import with:

```sh
bash scripts/import-dolt-docs.sh      # Dolt
bash scripts/import-doltlab-docs.sh   # DoltLab
bash scripts/import-doltgres-docs.sh  # Doltgres
```

These scripts copy markdown, convert GitBook syntax, fix links, add missing headings, and generate Astro page files. **Warning**: this overwrites all content and pages — commit any manual changes first.

## Building for production

```sh
cd site
npm run build          # Builds all three sites (includes Pagefind search index)
npm run preview        # Preview all three built sites
```

To build a single site:

```sh
cd site/dolt
npm run build          # Runs astro build + pagefind indexing
npm run preview        # Serves the built site
```

## Running tests

From the repo root:

```sh
# Build the site first
npm run build:dolt

# Start preview server and run Cypress tests
npm run preview:dolt &
npm run cy:run

# DoltLab / Doltgres
npm run build:doltlab && npm run preview:doltlab &
npm run cy:run:doltlab
```
