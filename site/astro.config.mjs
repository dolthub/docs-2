import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  site: "https://docs.dolthub.com",
  integrations: [tailwind(), react()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            class: "anchor-link",
            "aria-label": "Link to heading",
          },
          content: { type: "text", value: "#" },
        },
      ],
    ],
  },
  vite: {
    ssr: {
      noExternal: ["@dolthub/react-components"],
    },
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },
});
