import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    PagefindUI: new (opts: Record<string, unknown>) => unknown;
  }
}

export default function Search() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !containerRef.current) return;
    initialized.current = true;

    // Pagefind UI is loaded via a <script> tag in the layout.
    // Wait for it to be available on window, then initialize.
    function tryInit() {
      if (window.PagefindUI && containerRef.current) {
        new window.PagefindUI({
          element: containerRef.current,
          showSubResults: true,
          showImages: false,
        });
        return true;
      }
      return false;
    }

    if (!tryInit()) {
      // Not loaded yet — poll briefly
      let attempts = 0;
      const interval = setInterval(() => {
        if (tryInit() || ++attempts > 20) {
          clearInterval(interval);
        }
      }, 200);
    }
  }, []);

  return <div ref={containerRef} className="search-container" />;
}
