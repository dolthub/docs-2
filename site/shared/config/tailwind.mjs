// Shared Tailwind config builder; the caller passes in mergeConfig.
export function baseTailwindConfig(mergeConfig, contentPaths) {
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
      "../shared/components/**/*.{js,jsx,ts,tsx}",
      "./node_modules/@dolthub/react-components/dist/**/*.js",
    ],
  });
}
