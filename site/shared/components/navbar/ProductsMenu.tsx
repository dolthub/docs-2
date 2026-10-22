import {
  DesktopNavDropdown,
  MobileNavDropdown,
} from "@dolthub/react-components";
import { useIsSignedIn } from "@dolthub/react-hooks";
import React from "react";
import { HostedCard, ProductCard, SectionHeading } from "./Cards";
import { getProductSections } from "./products";

export default function ProductsMenu({ mobile = false }: { mobile?: boolean }) {
  const signedIn = useIsSignedIn("dolthubToken");
  const [databases, platforms] = getProductSections(
    "https://www.dolthub.com",
    signedIn,
  );
  const content = (
    <div className="docs-navbar-products">
      <div className="flex flex-col gap-4">
        <SectionHeading>{databases.heading}</SectionHeading>
        {databases.products.map((p) => (
          <ProductCard key={p.name} {...p} />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <SectionHeading>Hosting</SectionHeading>
        <HostedCard className="grow" />
      </div>
      <div className="flex flex-col gap-4">
        <SectionHeading>{platforms.heading}</SectionHeading>
        {platforms.products.map((p) => (
          <ProductCard key={p.name} {...p} />
        ))}
      </div>
    </div>
  );
  return mobile ? (
    <MobileNavDropdown label="Products" data-cy="mobile-navbar-products">
      {content}
    </MobileNavDropdown>
  ) : (
    <DesktopNavDropdown
      label="Products"
      hideCaret
      underlineOnOpen
      openOnHover
      panelClassName="bg-space-900"
      data-cy="navbar-products"
    >
      {content}
    </DesktopNavDropdown>
  );
}
