import { Navbar as Nav, DiscordButton, GithubButton } from "@dolthub/react-components";
import { FaDiscord } from "@react-icons/all-files/fa/FaDiscord";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaYoutube } from "@react-icons/all-files/fa/FaYoutube";
import { ExternalLink } from "@dolthub/react-components";
import React, { useState, useRef, useEffect } from "react";

const dolthubUrl = "https://www.dolthub.com";
const blogUrl = `${dolthubUrl}/blog`;

function isLocal(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

const prodDocsLinks = [
  { name: "Dolt", href: "https://docs.dolthub.com" },
  { name: "DoltLab", href: "https://docs.doltlab.com" },
  { name: "Doltgres", href: "https://docs.doltgres.com" },
];

const localDocsLinks = [
  { name: "Dolt", href: "http://localhost:4321" },
  { name: "DoltLab", href: "http://localhost:4322" },
  { name: "Doltgres", href: "http://localhost:4323" },
];

function useDocsLinks() {
  return isLocal() ? localDocsLinks : prodDocsLinks;
}
const doltGithub = "https://github.com/dolthub/dolt";
const doltDiscord = "https://discord.gg/gqr7K4VNKe";
const dolthubLinkedin = "https://www.linkedin.com/company/dolthubinc/";
const dolthubTwitter = "https://www.twitter.com/dolthub";
const dolthubYoutube =
  "https://www.youtube.com/channel/UCDPjHnjeQV0_knGaksmKTZw";

const siteNames: Record<string, string> = {
  dolt: "Dolt",
  doltlab: "DoltLab",
  doltgres: "Doltgres",
};

type NavbarProps = {
  siteName?: "dolt" | "doltlab" | "doltgres";
};

function Logo({ siteName = "dolt" }: NavbarProps) {
  const name = siteNames[siteName] || "Dolt";
  return (
    <a href="/" aria-label="logo home link" data-cy="navbar-logo" className="navbar-logo-link">
      <span className="navbar-logo-name">{name}</span>
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
            <a key={l.name} href={l.href} className="docs-dropdown-item">
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
      <DocsDropdown />
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
      <GithubButton href={doltGithub} dark />
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
