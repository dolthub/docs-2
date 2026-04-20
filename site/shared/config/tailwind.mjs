// Shared Tailwind configuration builder.
// mergeConfig must be passed in by the caller since it resolves from the
// site's own node_modules, not from shared/.

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
