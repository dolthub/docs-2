import { Navbar as Nav, DiscordButton, GithubButton, ExternalLink } from "@dolthub/react-components";
import { useIsSignedIn } from "@dolthub/react-hooks";
import { FaDiscord } from "@react-icons/all-files/fa/FaDiscord";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaYoutube } from "@react-icons/all-files/fa/FaYoutube";
import React, { useState, useRef, useEffect } from "react";

// The (non-HttpOnly) cookie the DoltHub app sets on login, so client JS can
// tell whether the visitor is signed in. Only readable on dolthub.com, so the
// Profile state shows there; doltlab/doltgres fall back to Sign In.
const dolthubTokenKey = "dolthubToken";

// "" (no base) or e.g. "/docs" — the base path every docs site is served under.
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

// One static build deploys to prod, awsdev, and local alike, so the matching
// docs links can only be chosen at runtime — by hostname.
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
const doltDiscord = "https://discord.gg/gqr7K4VNKe";

// GitHub repo whose star count the nav button shows, per docs site. DoltLab has
// no public repo of its own, so it shows Dolt's stars; Doltgres shows its own
// (dolthub/doltgresql). `fallbackStars` is shown until the live count loads (or
// if the API call fails), so the button never renders empty.
const githubBySite: Record<string, { repo: string; fallbackStars: number }> = {
  dolt: { repo: "dolthub/dolt", fallbackStars: 18000 },
  doltlab: { repo: "dolthub/dolt", fallbackStars: 18000 },
  doltgres: { repo: "dolthub/doltgresql", fallbackStars: 1400 },
};

// Cache window for the star count. The site is static (no backend) and the
// navbar re-mounts on every page load, so cache the count in localStorage and
// hit the unauthenticated GitHub API (60 req/hr per IP) at most once per
// visitor per interval — otherwise heavy browsing could get us rate limited.
const STARS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

// Live GitHub star count for `repo`, cached in localStorage. Shows `fallback`
// until a count is available; on a failed/rate-limited fetch it keeps the last
// known value and backs off (records the attempt time) for the TTL.
function useGithubStars(repo: string, fallback: number) {
  const [stars, setStars] = useState(fallback);
  useEffect(() => {
    const key = `docs-github-stars:${repo}`;
    let cached: { count?: number; ts?: number } = {};
    try {
      cached = JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      /* unparseable/unavailable storage — treat as empty */
    }
    if (typeof cached.count === "number") setStars(cached.count);
    if (cached.ts && Date.now() - cached.ts < STARS_CACHE_TTL_MS) return;

    let cancelled = false;
    const remember = (count?: number) => {
      try {
        localStorage.setItem(key, JSON.stringify({ count, ts: Date.now() }));
      } catch {
        /* ignore */
      }
    };
    fetch(`https://api.github.com/repos/${repo}`)
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => {
        const count = data?.stargazers_count;
        if (typeof count === "number") {
          if (!cancelled) setStars(count);
          remember(count);
        } else {
          remember(cached.count);
        }
      })
      .catch(() => remember(cached.count));
    return () => {
      cancelled = true;
    };
  }, [repo, fallback]);
  return stars;
}
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
    <div ref={ref} className="docs-dropdown relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        data-cy="navbar-documentation"
        className="docs-dropdown-trigger"
      >
        Documentation
        <svg width="10" height="6" viewBox="0 0 10 6" className="ml-1 inline">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="docs-dropdown-menu">
          {links.map(l => (
            <a key={l.name} href={l.href} className="docs-dropdown-item m-0 block">
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
  // .navbar-auth-btn (in DocsLayout) sets line-height: 1.5rem so this matches
  // the Discord/GitHub button height.
  const className =
    "navbar-auth-btn flex items-center border rounded px-3 py-[0.2rem] border-[#333C50]/20";
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

function RightLinks({ siteName = "dolt" }: NavbarProps) {
  const { repo, fallbackStars } = githubBySite[siteName] || githubBySite.dolt;
  const stars = useGithubStars(repo, fallbackStars);
  return (
    <div className="flex navbar-right">
      <DiscordButton href={doltDiscord} dark />
      <GithubButton
        href={`https://github.com/${repo}`}
        githubStarCount={stars}
        dark
      />
      <ProfileOrSignIn />
    </div>
  );
}

function MobileSocialLinks({ siteName = "dolt" }: NavbarProps) {
  const { repo } = githubBySite[siteName] || githubBySite.dolt;
  return (
    <>
      <ExternalLink href={dolthubLinkedin} aria-label="linkedin">
        <FaLinkedin />
      </ExternalLink>
      <ExternalLink href={`https://github.com/${repo}`} aria-label="github">
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
      rightLinks={<RightLinks siteName={siteName} />}
      rightLinksMobile={<MobileRightLinks />}
      mobileBottomLinks={<MobileSocialLinks siteName={siteName} />}
      bgColor="bg-transparent"
      dark
      logoLeft
    />
  );
}
