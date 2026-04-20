// Shared Tailwind configuration builder.
// Usage: import { baseTailwindConfig } from "../shared/config/tailwind.mjs";
//        export default baseTailwindConfig(["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"]);

import { mergeConfig } from "@dolthub/react-components";

export function baseTailwindConfig(contentPaths) {
  return mergeConfig({
    theme: {
      extend: {
        borderColor: {
          DEFAULT: "#D7D8DF",
        },
      },
    },
    content: [
      ...contentPaths,
      // Shared components
      "../shared/components/**/*.{js,jsx,ts,tsx}",
      // react-components dist (for Tailwind class detection)
      "./node_modules/@dolthub/react-components/dist/**/*.js",
    ],
  });
}
