import React, { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    PagefindUI: new (opts: Record<string, unknown>) => unknown;
  }
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  // Expose openSearch globally so other components can trigger it
  useEffect(() => {
    (window as any).__openDocsSearch = () => setOpen(true);
    return () => { delete (window as any).__openDocsSearch; };
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+K to open search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // (Re)initialize Pagefind UI every time the modal opens. The modal subtree
  // unmounts on close, destroying the Pagefind-injected DOM, so each open gets
  // a fresh container that needs a fresh PagefindUI instance.
  useEffect(() => {
    if (!open) return;

    let interval: ReturnType<typeof setInterval> | undefined;

    function tryInit() {
      if (window.PagefindUI && containerRef.current) {
        new window.PagefindUI({
          element: containerRef.current,
          showSubResults: true,
          showImages: false,
          autofocus: true,
        });
        return true;
      }
      return false;
    }

    if (!tryInit()) {
      let attempts = 0;
      interval = setInterval(() => {
        if (tryInit() || ++attempts > 20) {
          clearInterval(interval);
        }
      }, 200);
    }

    // Clear a pending poll if the modal closes (or unmounts) before Pagefind
    // loads — avoids a leaked interval and init into a stale container.
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open]);

  // Focus search input when modal opens
  useEffect(() => {
    if (open && containerRef.current) {
      setTimeout(() => {
        const input = containerRef.current?.querySelector("input");
        input?.focus();
      }, 100);
    }
  }, [open]);

  return (
    <>
      {/* Search trigger button */}
      <button className="search-trigger" onClick={openModal}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="search-trigger-text">Search</span>
        <kbd className="search-trigger-kbd">
          <span className="search-trigger-kbd-meta">⌘</span>K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="search-overlay" onClick={closeModal}>
          <div className="search-modal" onClick={e => e.stopPropagation()}>
            <div ref={containerRef} className="search-container" />
          </div>
        </div>
      )}
    </>
  );
}
