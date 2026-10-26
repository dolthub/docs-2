import images from "./images";

export type Product = {
  name: string;
  description: string;
  href: string;
  icon: string;
};

export type ProductSection = {
  heading: string;
  products: Product[];
};

export function getProductSections(
  appUrl: string,
  isSignedIn = false,
): ProductSection[] {
  return [
    {
      heading: "Version-controlled databases",
      products: [
        {
          name: "Dolt",
          description: "MySQL-compatible",
          href: "https://github.com/dolthub/dolt",
          icon: images.products.dolt,
        },
        {
          name: "DoltgreSQL",
          description: "PostgreSQL-compatible",
          href: "https://www.doltgres.com",
          icon: images.products.doltgresql,
        },
        {
          name: "DoltLite",
          description: "SQLite-compatible",
          href: "https://github.com/dolthub/doltlite",
          icon: images.products.doltlite,
        },
      ],
    },
    {
      heading: "Platforms & tools",
      products: [
        {
          name: "DoltHub",
          description: "Collaborate with forks, clones, and PRs",
          href: `${appUrl}/${isSignedIn ? "profile" : "signin"}`,
          icon: images.products.dolthub,
        },
        {
          name: "DoltLab",
          description: "DoltHub on your machine",
          href: "https://doltlab.com",
          icon: images.products.doltlab,
        },
        {
          name: "Dolt Workbench",
          description: "A desktop workbench with agent mode",
          href: "https://www.doltworkbench.com",
          icon: images.products.workbench,
        },
      ],
    },
  ];
}

export const hostedProduct = {
  name: "Hosted Dolt",
  description:
    "Fully managed version-controlled databases in the cloud. We handle operations, scaling, and backups.",
  href: "https://hosted.doltdb.com",
  cta: "Launch instance",
  ctaHref: `https://hosted.doltdb.com/create-deployment`,
};
