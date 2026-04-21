import type { NavSection } from "../../../shared/components";

const nav: NavSection[] = [
  {
    section: "Introduction",
    items: [
      { title: "What is DoltLab?", href: "/introduction/what-is-doltlab" },
      {
        title: "Getting Started",
        href: "/introduction/getting-started/getting-started",
        children: [
          { title: "AWS", href: "/introduction/getting-started/aws" },
          { title: "Azure", href: "/introduction/getting-started/azure" },
          { title: "GCP", href: "/introduction/getting-started/gcp" },
        ],
      },
    ],
  },
  {
    section: "Enterprise",
    items: [
      { title: "Why Enterprise?", href: "/enterprise/why" },
      { title: "Getting Started", href: "/enterprise/getting-started" },
    ],
  },
  {
    section: "Administrator Guides",
    items: [
      {
        title: "Installation",
        href: "/guides/installation",
        children: [
          { title: "Linux", href: "/guides/installation/linux" },
          { title: "Start DoltLab", href: "/guides/installation/start-doltlab" },
        ],
      },
      { title: "Basic", href: "/guides/basic" },
      { title: "Enterprise", href: "/guides/enterprise" },
    ],
  },
  {
    section: "Features",
    items: [
      { title: "Basic Features", href: "/features/basic" },
      {
        title: "Advanced Features",
        href: "/features/advanced",
        children: [
          { title: "API", href: "/features/advanced/api" },
          { title: "Workspaces", href: "/features/advanced/workspaces" },
          { title: "Transform File Uploads", href: "/features/advanced/transform-uploads" },
        ],
      },
    ],
  },
  {
    section: "Reference",
    items: [
      {
        title: "Installer",
        href: "/reference/installer",
        children: [
          { title: "Configuration File", href: "/reference/installer/configuration-file" },
          { title: "Command Line", href: "/reference/installer/cli" },
        ],
      },
      {
        title: "Release Notes",
        href: "/reference/release-notes",
        children: [
          { title: "v2.5.4", href: "/reference/release-notes/v2.5.4" },
          { title: "v2.5.3", href: "/reference/release-notes/v2.5.3" },
          { title: "v2.5.2", href: "/reference/release-notes/v2.5.2" },
          { title: "v2.5.1", href: "/reference/release-notes/v2.5.1" },
          { title: "v2.5.0", href: "/reference/release-notes/v2.5.0" },
          { title: "v2.4.7", href: "/reference/release-notes/v2.4.7" },
          { title: "v2.4.6", href: "/reference/release-notes/v2.4.6" },
          { title: "v2.4.5", href: "/reference/release-notes/v2.4.5" },
          { title: "v2.4.4", href: "/reference/release-notes/v2.4.4" },
          { title: "v2.4.3", href: "/reference/release-notes/v2.4.3" },
          { title: "v2.4.2", href: "/reference/release-notes/v2.4.2" },
          { title: "v2.4.1", href: "/reference/release-notes/v2.4.1" },
          { title: "v2.4.0", href: "/reference/release-notes/v2.4.0" },
          { title: "v2.3.14", href: "/reference/release-notes/v2.3.14" },
          { title: "v2.3.13", href: "/reference/release-notes/v2.3.13" },
          { title: "v2.3.12", href: "/reference/release-notes/v2.3.12" },
          { title: "v2.3.11", href: "/reference/release-notes/v2.3.11" },
          { title: "v2.3.10", href: "/reference/release-notes/v2.3.10" },
          { title: "v2.3.9", href: "/reference/release-notes/v2.3.9" },
          { title: "v2.3.8", href: "/reference/release-notes/v2.3.8" },
          { title: "v2.3.7", href: "/reference/release-notes/v2.3.7" },
          { title: "v2.3.6", href: "/reference/release-notes/v2.3.6" },
          { title: "v2.3.5", href: "/reference/release-notes/v2.3.5" },
          { title: "v2.3.4", href: "/reference/release-notes/v2.3.4" },
          { title: "v2.3.3", href: "/reference/release-notes/v2.3.3" },
          { title: "v2.3.2", href: "/reference/release-notes/v2.3.2" },
          { title: "v2.3.1", href: "/reference/release-notes/v2.3.1" },
          { title: "v2.3.0", href: "/reference/release-notes/v2.3.0" },
          { title: "v2.2.2", href: "/reference/release-notes/v2.2.2" },
          { title: "v2.2.1", href: "/reference/release-notes/v2.2.1" },
          { title: "v2.2.0", href: "/reference/release-notes/v2.2.0" },
          { title: "v2.1.6", href: "/reference/release-notes/v2.1.6" },
          { title: "v2.1.5", href: "/reference/release-notes/v2.1.5" },
          { title: "v2.1.4", href: "/reference/release-notes/v2.1.4" },
          { title: "v2.1.3", href: "/reference/release-notes/v2.1.3" },
          { title: "v2.1.2", href: "/reference/release-notes/v2.1.2" },
          { title: "v2.1.1", href: "/reference/release-notes/v2.1.1" },
          { title: "v2.1.0", href: "/reference/release-notes/v2.1.0" },
          { title: "v2.0.8", href: "/reference/release-notes/v2.0.8" },
          { title: "v2.0.7", href: "/reference/release-notes/v2.0.7" },
          { title: "v2.0.6", href: "/reference/release-notes/v2.0.6" },
          { title: "v2.0.5", href: "/reference/release-notes/v2.0.5" },
          { title: "v2.0.4", href: "/reference/release-notes/v2.0.4" },
          { title: "v2.0.3", href: "/reference/release-notes/v2.0.3" },
          { title: "v2.0.2", href: "/reference/release-notes/v2.0.2" },
          { title: "v2.0.1", href: "/reference/release-notes/v2.0.1" },
          { title: "v2.0.0", href: "/reference/release-notes/v2.0.0" },
        ],
      },
    ],
  },
  {
    section: "Older Versions",
    items: [
      {
        title: "Installation",
        href: "/older/installation",
        children: [
          { title: "Linux pre-installer", href: "/older/installation/pre-installer-linux" },
          { title: "Start DoltLab pre-installer", href: "/older/installation/start-doltlab-pre-installer" },
        ],
      },
      { title: "Upgrade", href: "/older/upgrading" },
      { title: "Administrator Guide", href: "/older/pre-installer-administrator-guide" },
    ],
  },
];

export default nav;
