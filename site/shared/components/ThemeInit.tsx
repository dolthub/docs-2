import { ThemeProvider } from "@dolthub/react-components";
import React from "react";

// Runs ThemeProvider's effect to set the CSS variables react-components needs
// (--color-primary, --color-background-acc-1, etc.). Renders nothing visible.
export default function ThemeInit() {
  return (
    <ThemeProvider>
      <span />
    </ThemeProvider>
  );
}
