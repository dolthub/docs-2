// All pages from packages/doltlab/content/SUMMARY.md
// path: URL path relative to https://docs.doltlab.com
// title: expected h1 text (matches SUMMARY.md link text)

import { DocPage } from "./dolt-pages";
export type { DocPage };

export const introductionPages: DocPage[] = [
  { path: "/introduction/what-is-doltlab", title: "What is DoltLab?" },
  {
    path: "/introduction/getting-started/getting-started",
    title: "Getting Started",
  },
  { path: "/introduction/getting-started/aws", title: "AWS" },
  { path: "/introduction/getting-started/azure", title: "Azure" },
  { path: "/introduction/getting-started/gcp", title: "GCP" },
];

export const enterprisePages: DocPage[] = [
  { path: "/enterprise/why", title: "Why Enterprise?" },
  { path: "/enterprise/getting-started", title: "Getting Started" },
];

export const guidesPages: DocPage[] = [
  { path: "/guides/installation", title: "Installation" },
  { path: "/guides/installation/linux", title: "Linux" },
  { path: "/guides/installation/start-doltlab", title: "Start DoltLab" },
  { path: "/guides/basic", title: "Basic" },
  { path: "/guides/enterprise", title: "Enterprise" },
];

export const featuresPages: DocPage[] = [
  { path: "/features/basic", title: "Basic Features" },
  { path: "/features/advanced", title: "Advanced Features" },
  { path: "/features/advanced/api", title: "API" },
  { path: "/features/advanced/workspaces", title: "Workspaces" },
  {
    path: "/features/advanced/transform-uploads",
    title: "Transform File Uploads",
  },
];

export const referencePages: DocPage[] = [
  { path: "/reference/installer", title: "Installer" },
  {
    path: "/reference/installer/configuration-file",
    title: "Configuration file reference",
  },
  { path: "/reference/installer/cli", title: "Command line reference" },
  { path: "/reference/release-notes", title: "Release Notes" },
];

// Release note pages — kept separate so they can be excluded from slower
// content checks while still being covered by the URL existence tests.
export const releaseNotePages: DocPage[] = [
  { path: "/reference/release-notes/v2.5.4", title: "v2.5.4" },
  { path: "/reference/release-notes/v2.5.3", title: "v2.5.3" },
  { path: "/reference/release-notes/v2.5.2", title: "v2.5.2" },
  { path: "/reference/release-notes/v2.5.1", title: "v2.5.1" },
  { path: "/reference/release-notes/v2.5.0", title: "v2.5.0" },
  { path: "/reference/release-notes/v2.4.7", title: "v2.4.7" },
  { path: "/reference/release-notes/v2.4.6", title: "v2.4.6" },
  { path: "/reference/release-notes/v2.4.5", title: "v2.4.5" },
  { path: "/reference/release-notes/v2.4.4", title: "v2.4.4" },
  { path: "/reference/release-notes/v2.4.3", title: "v2.4.3" },
  { path: "/reference/release-notes/v2.4.2", title: "v2.4.2" },
  { path: "/reference/release-notes/v2.4.1", title: "v2.4.1" },
  { path: "/reference/release-notes/v2.4.0", title: "v2.4.0" },
  { path: "/reference/release-notes/v2.3.14", title: "v2.3.14" },
  { path: "/reference/release-notes/v2.3.13", title: "v2.3.13" },
  { path: "/reference/release-notes/v2.3.12", title: "v2.3.12" },
  { path: "/reference/release-notes/v2.3.11", title: "v2.3.11" },
  { path: "/reference/release-notes/v2.3.10", title: "v2.3.10" },
  { path: "/reference/release-notes/v2.3.9", title: "v2.3.9" },
  { path: "/reference/release-notes/v2.3.8", title: "v2.3.8" },
  { path: "/reference/release-notes/v2.3.7", title: "v2.3.7" },
  { path: "/reference/release-notes/v2.3.6", title: "v2.3.6" },
  { path: "/reference/release-notes/v2.3.5", title: "v2.3.5" },
  { path: "/reference/release-notes/v2.3.4", title: "v2.3.4" },
  { path: "/reference/release-notes/v2.3.3", title: "v2.3.3" },
  { path: "/reference/release-notes/v2.3.2", title: "v2.3.2" },
  { path: "/reference/release-notes/v2.3.1", title: "v2.3.1" },
  { path: "/reference/release-notes/v2.3.0", title: "v2.3.0" },
  { path: "/reference/release-notes/v2.2.2", title: "v2.2.2" },
  { path: "/reference/release-notes/v2.2.1", title: "v2.2.1" },
  { path: "/reference/release-notes/v2.2.0", title: "v2.2.0" },
  { path: "/reference/release-notes/v2.1.6", title: "v2.1.6" },
  { path: "/reference/release-notes/v2.1.5", title: "v2.1.5" },
  { path: "/reference/release-notes/v2.1.4", title: "v2.1.4" },
  { path: "/reference/release-notes/v2.1.3", title: "v2.1.3" },
  { path: "/reference/release-notes/v2.1.2", title: "v2.1.2" },
  { path: "/reference/release-notes/v2.1.1", title: "v2.1.1" },
  { path: "/reference/release-notes/v2.1.0", title: "v2.1.0" },
  { path: "/reference/release-notes/v2.0.8", title: "v2.0.8" },
  { path: "/reference/release-notes/v2.0.7", title: "v2.0.7" },
  { path: "/reference/release-notes/v2.0.6", title: "v2.0.6" },
  { path: "/reference/release-notes/v2.0.5", title: "v2.0.5" },
  { path: "/reference/release-notes/v2.0.4", title: "v2.0.4" },
  { path: "/reference/release-notes/v2.0.3", title: "v2.0.3" },
  { path: "/reference/release-notes/v2.0.2", title: "v2.0.2" },
  { path: "/reference/release-notes/v2.0.1", title: "v2.0.1" },
  { path: "/reference/release-notes/v2.0.0", title: "v2.0.0" },
];

export const olderVersionsPages: DocPage[] = [
  {
    path: "/older-versions/installation",
    title: "Installation",
  },
  { path: "/older-versions/upgrade", title: "Upgrade" },
  {
    path: "/older-versions/administrator",
    title: "Administrator Guide",
  },
];

export const allDoltlabPages: DocPage[] = [
  ...introductionPages,
  ...enterprisePages,
  ...guidesPages,
  ...featuresPages,
  ...referencePages,
  ...releaseNotePages,
  ...olderVersionsPages,
];

// Core pages excluding release notes — useful for content spot-checks
export const coreDoltlabPages: DocPage[] = [
  ...introductionPages,
  ...enterprisePages,
  ...guidesPages,
  ...featuresPages,
  ...referencePages,
];
