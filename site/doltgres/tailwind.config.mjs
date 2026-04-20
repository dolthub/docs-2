import { mergeConfig } from "@dolthub/react-components";
import { baseTailwindConfig } from "../shared/config/tailwind.mjs";

export default baseTailwindConfig(mergeConfig, [
  "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",
]);
