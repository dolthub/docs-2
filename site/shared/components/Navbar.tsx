import { Navbar as Nav, ExternalLink } from "@dolthub/react-components";
import { FaDiscord } from "@react-icons/all-files/fa/FaDiscord";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaYoutube } from "@react-icons/all-files/fa/FaYoutube";
import { FaMoon } from "@react-icons/all-files/fa/FaMoon";
import { FaSun } from "@react-icons/all-files/fa/FaSun";
import React, { useState, useRef, useEffect } from "react";

// "" (no base) or e.g. "/docs" — every docs site is served under this base
// path. All three sites share the same base, so the current site's
// import.meta.env.BASE_URL also applies to the cross-product docs links.
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

const dolthubUrl = "https://www.dolthub.com";
const blogUrl = `${dolthubUrl}/blog`;

const prodDocsLinks = [
  { name: "Dolt", href: `https://dolthub.com${BASE}` },
  { name: "DoltLab", href: `https://doltlab.com${BASE}` },
  { name: "Doltgres", href: `https://doltgres.com${BASE}` },
];

// awsdev deploy: each product's docs live on its own *.awsdev.ld-corp.com host.
const devDocsLinks = [
  { name: "Dolt", href: `https://dolthub.awsdev.ld-corp.com${BASE}` },
  { name: "DoltLab", href: `https://doltlab.awsdev.ld-corp.com${BASE}` },
  { name: "Doltgres", href: `https://doltgres.awsdev.ld-corp.com${BASE}` },
];

const localDocsLinks = [
  { name: "Dolt", href: `http://localhost:4321${BASE}` },
  { name: "DoltLab", href: `http://localhost:4322${BASE}` },
  { name: "Doltgres", href: `http://localhost:4323${BASE}` },
];

// The cross-product docs links must point at the same environment the
// current page is served from. The three sites ship one static build that's
// deployed to prod, awsdev, and the local dev servers alike, so the
// environment can only be known at runtime — pick the link set by hostname.
function docsLinksForHost(hostname: string) {
  if (hostname === "localhost" || hostname === "127.0.0.1") return localDocsLinks;
  if (hostname.endsWith(".awsdev.ld-corp.com")) return devDocsLinks;
  return prodDocsLinks;
}

function useDocsLinks() {
  // Default to prod for SSR / first paint; correct it once we know the host.
  const [links, setLinks] = useState(prodDocsLinks);
  useEffect(() => {
    setLinks(docsLinksForHost(window.location.hostname));
  }, []);
  return links;
}
const doltGithub = "https://github.com/dolthub/dolt";
const doltDiscord = "https://discord.gg/gqr7K4VNKe";
const dolthubLinkedin = "https://www.linkedin.com/company/dolthubinc/";
const dolthubTwitter = "https://www.twitter.com/dolthub";
const dolthubYoutube =
  "https://www.youtube.com/channel/UCDPjHnjeQV0_knGaksmKTZw";

const siteConfig: Record<string, { alt: string }> = {
  dolt: { alt: "Dolt" },
  doltlab: { alt: "DoltLab" },
  doltgres: { alt: "Doltgres" },
};

type NavbarProps = {
  siteName?: "dolt" | "doltlab" | "doltgres";
};

function Logo({ siteName = "dolt" }: NavbarProps) {
  const config = siteConfig[siteName] || siteConfig.dolt;
  return (
    <a href={`${BASE}/`} aria-label="logo home link" data-cy="navbar-logo" className="navbar-logo-link">
      <img src={`${BASE}/images/logo.png`} alt={config.alt} className="navbar-logo-img" />
      <span className="navbar-logo-docs">Docs</span>
    </a>
  );
}

function DocsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const links = useDocsLinks();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="docs-dropdown" style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        data-cy="navbar-documentation"
        className="docs-dropdown-trigger"
      >
        Documentation
        <svg width="10" height="6" viewBox="0 0 10 6" style={{ marginLeft: 4, display: "inline" }}>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="docs-dropdown-menu">
          {links.map(l => (
            <a key={l.name} href={l.href} className="docs-dropdown-item" style={{ margin: 0, display: "block" }}>
              {l.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function LeftLinks() {
  return (
    <>
      <a href={`${dolthubUrl}/discover`} data-cy="navbar-databases">
        Databases
      </a>
      <a href={`${dolthubUrl}/pricing`} data-cy="navbar-pricing">
        Pricing
      </a>
      <span className="docs-dropdown-desktop-only">
        <DocsDropdown />
      </span>
      <a href={blogUrl} data-cy="navbar-blog">
        Blog
      </a>
    </>
  );
}

// Light/dark theme toggle. The `dark` class on <html> is applied before
// paint by the no-flash init script in DocsLayout; this just flips it and
// persists the choice. Toggle instances stay in sync via a window event so
// the desktop and mobile copies show the same icon.
const THEME_KEY = "docs-theme";

function setDarkMode(dark: boolean) {
  const de = document.documentElement;
  de.classList.toggle("dark", dark);
  // Mirror the no-flash inline styles set by the head script in DocsLayout so
  // a later page load (or this toggle) never shows the wrong root canvas.
  // Keep these colors in sync with that script and the body background CSS.
  de.style.colorScheme = dark ? "dark" : "light";
  de.style.backgroundColor = dark ? "#0d1117" : "#f1f3f8";
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {
    /* localStorage unavailable (private mode, etc.) — ignore */
  }
  window.dispatchEvent(new CustomEvent("docs-themechange", { detail: { dark } }));
}

function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    function onChange(e: Event) {
      setDark((e as CustomEvent<{ dark: boolean }>).detail.dark);
    }
    window.addEventListener("docs-themechange", onChange);
    return () => window.removeEventListener("docs-themechange", onChange);
  }, []);
  const seg = "navbar-theme-toggle-seg";
  const active = `${seg} navbar-theme-toggle-seg-active`;
  return (
    <div
      className="navbar-theme-toggle"
      data-cy="navbar-theme-toggle"
      role="group"
      aria-label="Color theme"
    >
      <button
        type="button"
        onClick={() => setDarkMode(false)}
        className={dark ? seg : active}
        aria-label="Switch to light mode"
        aria-pressed={!dark}
        title="Light mode"
      >
        <FaSun />
      </button>
      <button
        type="button"
        onClick={() => setDarkMode(true)}
        className={dark ? active : seg}
        aria-label="Switch to dark mode"
        aria-pressed={dark}
        title="Dark mode"
      >
        <FaMoon />
      </button>
    </div>
  );
}

function RightLinks() {
  return (
    <div className="flex navbar-right">
      <ExternalLink href={doltDiscord} data-cy="discord-link" aria-label="Discord">
        <span className="navbar-icon-btn">
          <FaDiscord />
          <span className="navbar-icon-btn-label">Discord</span>
        </span>
      </ExternalLink>
      <ExternalLink href={doltGithub} data-cy="github-link" aria-label="GitHub">
        <span className="navbar-icon-btn">
          <FaGithub />
          <span className="navbar-icon-btn-label">GitHub</span>
        </span>
      </ExternalLink>
      <DarkModeToggle />
    </div>
  );
}

function MobileSocialLinks() {
  return (
    <>
      <ExternalLink href={dolthubLinkedin} aria-label="linkedin">
        <FaLinkedin />
      </ExternalLink>
      <ExternalLink href={doltGithub} aria-label="github">
        <FaGithub />
      </ExternalLink>
      <ExternalLink href={doltDiscord} aria-label="discord">
        <FaDiscord />
      </ExternalLink>
      <ExternalLink href={dolthubYoutube} aria-label="youtube">
        <FaYoutube />
      </ExternalLink>
      <ExternalLink href={dolthubTwitter} aria-label="twitter">
        <FaTwitter />
      </ExternalLink>
    </>
  );
}

function MobileRightLinks() {
  const links = useDocsLinks();
  return (
    <>
      {links.map(l => (
        <a key={l.name} href={l.href}>
          {l.name} Docs
        </a>
      ))}
      <DarkModeToggle />
    </>
  );
}

export default function DocsNavbar({ siteName = "dolt" }: NavbarProps) {
  return (
    <Nav
      logo={<Logo siteName={siteName} />}
      leftLinks={<LeftLinks />}
      rightLinks={<RightLinks />}
      rightLinksMobile={<MobileRightLinks />}
      mobileBottomLinks={<MobileSocialLinks />}
      bgColor="bg-transparent"
      dark
      logoLeft
    />
  );
}
