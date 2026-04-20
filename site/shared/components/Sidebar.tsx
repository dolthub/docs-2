import React, { useState, useEffect } from "react";

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

function isActive(href: string | undefined, currentPath: string): boolean {
  if (!href) return false;
  const clean = (p: string) => p.replace(/\/$/, "") || "/";
  return clean(href) === clean(currentPath);
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
      <div className="flex items-center">
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="sidebar-chevron"
            aria-label={open ? "Collapse" : "Expand"}
            style={{ marginLeft: paddingLeft }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className={`transition-transform duration-150 ${open ? "rotate-90" : ""}`}
            >
              <path d="M3 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        )}
        {item.href ? (
          <a
            href={item.href}
            className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
            style={{ paddingLeft: hasChildren ? 4 : paddingLeft + 14 }}
          >
            {item.title}
          </a>
        ) : (
          <button
            onClick={() => setOpen(!open)}
            className="sidebar-link sidebar-link-section"
            style={{ paddingLeft: hasChildren ? 4 : paddingLeft + 14 }}
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

export default function Sidebar({ nav, currentPath }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"
          />
        </svg>
        <span>Menu</span>
      </button>

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
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
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
