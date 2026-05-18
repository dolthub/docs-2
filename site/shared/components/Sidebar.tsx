import React, { useState, useEffect, useRef } from "react";

export type NavItem = {
  title: string;
  href?: string;
  children?: NavItem[];
};

export type NavSection = {
  section: string;
  items: NavItem[];
};

type SidebarProps = {
  nav: NavSection[];
  currentPath: string;
};

// The site may be served under a base path (e.g. /docs). Astro rewrites its
// own page routes for `base`, but nav hrefs in nav.ts are authored as plain
// "/foo" — prefix the base so links and active-state matching line up with
// the base-prefixed pathname Astro reports.
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");

function withBase(href: string | undefined): string | undefined {
  if (!href || !href.startsWith("/") || href.startsWith("//")) return href;
  if (BASE && (href === BASE || href.startsWith(BASE + "/"))) return href;
  return BASE + href;
}

function isActive(href: string | undefined, currentPath: string): boolean {
  if (!href) return false;
  const clean = (p: string) => p.replace(/\/$/, "") || "/";
  return clean(withBase(href)!) === clean(currentPath);
}

function hasActiveChild(item: NavItem, currentPath: string): boolean {
  if (isActive(item.href, currentPath)) return true;
  return item.children?.some(c => hasActiveChild(c, currentPath)) ?? false;
}

function NavLink({
  item,
  currentPath,
  depth,
}: {
  item: NavItem;
  currentPath: string;
  depth: number;
}) {
  const active = isActive(item.href, currentPath);
  const hasChildren = item.children && item.children.length > 0;
  const childActive = hasChildren && hasActiveChild(item, currentPath);
  const [open, setOpen] = useState(childActive || active);

  useEffect(() => {
    if (childActive || active) setOpen(true);
  }, [childActive, active]);

  const paddingLeft = depth * 12;

  return (
    <li>
      <div className={`sidebar-row ${active ? "sidebar-row-active" : ""}`} style={{ paddingLeft: paddingLeft }}>
        <span
          className={`sidebar-chevron ${hasChildren ? "" : "sidebar-chevron-hidden"}`}
          onClick={hasChildren ? () => setOpen(!open) : undefined}
          role={hasChildren ? "button" : undefined}
          aria-label={hasChildren ? (open ? "Collapse" : "Expand") : undefined}
        >
          {hasChildren && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className={`transition-transform duration-150 ${open ? "rotate-90" : ""}`}
            >
              <path d="M3 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </span>
        {item.href ? (
          <a
            href={withBase(item.href)}
            className="sidebar-link"
          >
            {item.title}
          </a>
        ) : (
          <button
            onClick={() => setOpen(!open)}
            className="sidebar-link sidebar-link-section"
          >
            {item.title}
          </button>
        )}
      </div>
      {hasChildren && open && (
        <ul className="sidebar-children">
          {item.children!.map((child, i) => (
            <NavLink
              key={child.href || i}
              item={child}
              currentPath={currentPath}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarNav({ nav, currentPath }: SidebarProps) {
  return (
    <nav>
      {nav.map((section) => (
        <div key={section.section} className="sidebar-section">
          <h3 className="sidebar-section-title">{section.section}</h3>
          <ul className="sidebar-list">
            {section.items.map((item, i) => (
              <NavLink
                key={item.href || i}
                item={item}
                currentPath={currentPath}
                depth={0}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// Desktop sidebar — rendered inside the sidebar-slot
export default function Sidebar({ nav, currentPath }: SidebarProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const active = ref.current.querySelector(".sidebar-row-active") as HTMLElement;
    if (active && ref.current) {
      // Scroll only the sidebar, not the page
      const sidebar = ref.current;
      const activeTop = active.offsetTop;
      const sidebarHeight = sidebar.clientHeight;
      sidebar.scrollTop = activeTop - sidebarHeight / 2;
    }
  }, []);

  return (
    <aside className="sidebar-desktop" ref={ref}>
      <SidebarNav nav={nav} currentPath={currentPath} />
    </aside>
  );
}

// Mobile sidebar — rendered outside the sidebar-slot so it's not constrained
export function MobileSidebar({ nav, currentPath }: SidebarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [currentPath]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle docs navigation"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="14" height="14" rx="2" />
          <line x1="5.5" y1="1" x2="5.5" y2="15" />
          <line x1="8" y1="5" x2="12" y2="5" />
          <line x1="8" y1="8" x2="12" y2="8" />
          <line x1="8" y1="11" x2="11" y2="11" />
        </svg>
        <span>Table of contents</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="sidebar-mobile-chevron">
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar-mobile ${open ? "sidebar-mobile-open" : ""}`}>
        <div className="sidebar-mobile-header">
          <button
            className="sidebar-mobile-close"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
        <button
          className="sidebar-mobile-search"
          onClick={() => {
            setOpen(false);
            setTimeout(() => {
              (window as any).__openDocsSearch?.();
            }, 250);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Search docs...</span>
        </button>
        <SidebarNav nav={nav} currentPath={currentPath} />
      </aside>
    </>
  );
}
