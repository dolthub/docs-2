import { Navbar as Nav, DiscordButton, ExternalLink } from "@dolthub/react-components";
import { useIsSignedIn } from "@dolthub/react-hooks";
import { FaDiscord } from "@react-icons/all-files/fa/FaDiscord";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaYoutube } from "@react-icons/all-files/fa/FaYoutube";
import React, { useState, useRef, useEffect } from "react";

// Name of the (non-HttpOnly) cookie the DoltHub app sets on login, so client
// JS can tell whether the visitor is signed in. Must match dolthub's
// `dolthubTokenKey`; useIsSignedIn reads it via js-cookie. The cookie is only
// readable on dolthub.com, so the signed-in "Profile" state shows there (the
// docs are served at dolthub.com/docs); doltlab.com/doltgres.com fall back to
// "Sign In", which is correct since there's no DoltHub session on those hosts.
const dolthubTokenKey = "dolthubToken";

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
        DoltHub
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

// Sign In when no DoltHub session cookie, Profile when there is one — mirrors
// the DoltHub app navbar's own Sign In / Profile logic.
function ProfileOrSignIn() {
  const isSignedIn = useIsSignedIn(dolthubTokenKey);
  // .navbar-auth-btn sets line-height: 1.5rem in DocsLayout (with enough
  // specificity to beat the library's `a { line-height: 1.25rem }`) so this
  // button is the same height as the Discord/GitHub icon buttons.
  const className =
    "navbar-auth-btn flex items-center border rounded-[0.25rem] px-3 py-[0.2rem] border-[#333C50]/20";
  return isSignedIn ? (
    <a
      href={`${dolthubUrl}/profile`}
      data-cy="navbar-desktop-profile-link"
      className={className}
      aria-label="desktop-profile"
    >
      Profile
    </a>
  ) : (
    <a
      href={`${dolthubUrl}/signin`}
      data-cy="navbar-signin-button"
      className={className}
      aria-label="desktop-signin"
    >
      Sign In
    </a>
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
      <ProfileOrSignIn />
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
  const isSignedIn = useIsSignedIn(dolthubTokenKey);
  return (
    <>
      {links.map(l => (
        <a key={l.name} href={l.href}>
          {l.name} Docs
        </a>
      ))}
      {isSignedIn ? (
        <a href={`${dolthubUrl}/profile`} data-cy="navbar-mobile-profile-link">
          Profile
        </a>
      ) : (
        <a href={`${dolthubUrl}/signin`}>Sign In</a>
      )}
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
