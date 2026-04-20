import { mergeConfig } from "@dolthub/react-components";

/** @type {import('tailwindcss').Config} */
const config = mergeConfig({
  theme: {
    extend: {
      borderColor: {
        DEFAULT: "#D7D8DF",
      },
    },
  },
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",
    "./node_modules/@dolthub/react-components/dist/**/*.js",
  ],
});

export default config;
