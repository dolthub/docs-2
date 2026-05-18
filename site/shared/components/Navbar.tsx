import { Navbar as Nav, DiscordButton, ExternalLink } from "@dolthub/react-components";
import { FaDiscord } from "@react-icons/all-files/fa/FaDiscord";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaYoutube } from "@react-icons/all-files/fa/FaYoutube";
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

const localDocsLinks = [
  { name: "Dolt", href: `http://localhost:4321${BASE}` },
  { name: "DoltLab", href: `http://localhost:4322${BASE}` },
  { name: "Doltgres", href: `http://localhost:4323${BASE}` },
];

function useDocsLinks() {
  const [links, setLinks] = useState(prodDocsLinks);
  useEffect(() => {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      setLinks(localDocsLinks);
    }
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
    <div ref={ref} className="docs-dropdown" style={{ position: "relative", display: "inline-block", marginLeft: "0.5rem", marginRight: "2.5rem" }}>
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

function RightLinks() {
  return (
    <div className="flex navbar-right">
      <DiscordButton href={doltDiscord} dark />
      <ExternalLink href={doltGithub} data-cy="github-link" aria-label="GitHub">
        <span className="navbar-icon-btn">
          <FaGithub />
          <span className="navbar-icon-btn-label">GitHub</span>
        </span>
      </ExternalLink>
      <a
        href={`${dolthubUrl}/signin`}
        data-cy="navbar-signin-button"
        className="flex items-center border rounded-[0.25rem] px-8 py-[0.2rem] border-[#333C50]/20"
        aria-label="desktop-signin"
      >
        Sign In
      </a>
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
      <a href={`${dolthubUrl}/signin`}>Sign In</a>
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
