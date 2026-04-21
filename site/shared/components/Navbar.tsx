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

const docsLinks = [
  { name: "Dolt", href: "https://docs.dolthub.com" },
  { name: "DoltLab", href: "https://docs.doltlab.com" },
  { name: "Doltgres", href: "https://docs.doltgres.com" },
];
const doltGithub = "https://github.com/dolthub/dolt";
const doltDiscord = "https://discord.gg/gqr7K4VNKe";
const dolthubLinkedin = "https://www.linkedin.com/company/dolthubinc/";
const dolthubTwitter = "https://www.twitter.com/dolthub";
const dolthubYoutube =
  "https://www.youtube.com/channel/UCDPjHnjeQV0_knGaksmKTZw";

// Inline DoltHub logo SVG data URI (from shared-components/images.ts)
const dolthubGreenLogo =
  "data:image/svg+xml,%3Csvg width='112' height='21' viewBox='0 0 112 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.9442 2.64868V16.7489C10.9425 17.089 10.809 17.4148 10.5728 17.6555C10.3365 17.8962 10.0165 18.0323 9.68214 18.0343H4.26964C3.93401 18.0343 3.61203 17.8991 3.37411 17.6582C3.13618 17.4173 3.00168 17.0904 3 16.7489V9.08768C3.00168 8.74616 3.13618 8.41921 3.37411 8.17832C3.61203 7.93743 3.93401 7.8022 4.26964 7.80221H8.5255' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M57.2324 18.0344H53.2305' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M57.1331 7.9082H49.1953' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M53.25 2.6499V18.0343' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M26.7109 2.88H21.9066C21.0413 2.88 20.3398 3.59377 20.3398 4.47425V16.3652C20.3398 17.2457 21.0413 17.9595 21.9066 17.9595H26.7109C27.5762 17.9595 28.2777 17.2457 28.2777 16.3652V4.47425C28.2777 3.59377 27.5762 2.88 26.7109 2.88Z' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M43.8962 18.0344H36.5703' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M40.5391 2.6499V18.0343' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M40.3723 2.63196H36.3438' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M74.7366 18.0345V9.08784C74.735 8.74766 74.6015 8.42187 74.3652 8.1812C74.1289 7.94053 73.8089 7.80441 73.4746 7.80237H69.2188' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M103.889 7.80237H108.145C108.479 7.80441 108.799 7.94053 109.035 8.1812C109.272 8.42187 109.405 8.74766 109.407 9.08784V16.5811C109.407 16.9663 109.256 17.3358 108.989 17.6083C108.721 17.8809 108.358 18.0341 107.98 18.0345H101.422' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M66.7969 2.6499V18.0343' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M84.1328 2.88V16.3639C84.1318 16.5742 84.1717 16.7826 84.2503 16.9771C84.3288 17.1716 84.4444 17.3483 84.5904 17.4972C84.7364 17.646 84.91 17.7639 85.101 17.8441C85.292 17.9244 85.4967 17.9653 85.7034 17.9646H90.5077C90.9232 17.9646 91.3217 17.7967 91.6156 17.4977C91.9094 17.1987 92.0745 16.7932 92.0745 16.3704V2.88' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M101.422 2.6499V18.0343' stroke='%2329E3C1' stroke-width='4.59866' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A";

function Logo() {
  return (
    <a href={dolthubUrl} aria-label="logo home link" data-cy="navbar-logo">
      <img src={dolthubGreenLogo} alt="DoltHub" />
    </a>
  );
}

function DocsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
          {docsLinks.map(l => (
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
      <DiscordButton href={doltDiscord} />
      <GithubButton href={doltGithub} />
      <a
        href={`${dolthubUrl}/signin`}
        data-cy="navbar-signin-button"
        className="flex items-center border rounded-[0.25rem] px-8 py-[0.2rem] border-white/10"
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
  return (
    <>
      {docsLinks.map(l => (
        <a key={l.name} href={l.href}>
          {l.name} Docs
        </a>
      ))}
      <a href={`${dolthubUrl}/signin`}>Sign In</a>
    </>
  );
}

export default function DocsNavbar() {
  return (
    <Nav
      logo={<Logo />}
      leftLinks={<LeftLinks />}
      rightLinks={<RightLinks />}
      rightLinksMobile={<MobileRightLinks />}
      mobileBottomLinks={<MobileSocialLinks />}
      bgColor="bg-background-acc-1"
      logoLeft
    />
  );
}
