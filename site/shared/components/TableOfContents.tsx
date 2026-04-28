import React, { useEffect, useRef, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from the article content after mount
  useEffect(() => {
    const article = document.querySelector(".docs-article");
    if (!article) return;

    const elements = article.querySelectorAll("h2[id], h3[id]");
    const items: Heading[] = [];
    elements.forEach(el => {
      const id = el.getAttribute("id");
      if (!id) return;
      // Get text without the anchor link "#"
      const text = el.textContent?.replace(/#$/, "").trim() || "";
      const level = el.tagName === "H2" ? 2 : 3;
      items.push({ id, text, level });
    });
    setHeadings(items);
  }, []);

  // Track which heading is currently in view
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        // Find the first visible heading
        const visible = entries.find(e => e.isIntersecting);
        if (visible?.target) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Scroll active ToC link into view when activeId changes
  const tocRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!activeId || !tocRef.current) return;
    const activeLink = tocRef.current.querySelector(".toc-link-active");
    if (activeLink) {
      activeLink.scrollIntoView({ block: "nearest" });
    }
  }, [activeId]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc" ref={tocRef} aria-label="Table of contents">
      <h4 className="toc-title">On this page</h4>
      <ul className="toc-list">
        {headings.map(({ id, text, level }) => (
          <li key={id} className={level === 3 ? "toc-item-nested" : ""}>
            <a
              href={`#${id}`}
              className={`toc-link ${activeId === id ? "toc-link-active" : ""}`}
              onClick={e => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: "smooth" });
                  setActiveId(id);
                  history.replaceState(null, "", `#${id}`);
                }
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
