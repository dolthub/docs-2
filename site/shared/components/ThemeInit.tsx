import { ThemeProvider } from "@dolthub/react-components";
import React from "react";

// Initializes the CSS variables that react-components' Tailwind theme
// relies on (--color-primary, --color-background-acc-1, etc.).
// Renders nothing visible — just runs ThemeProvider's useEffect.
export default function ThemeInit() {
  return (
    <ThemeProvider>
      <span />
    </ThemeProvider>
  );
}
