import React from "react";
import images from "./images";
import { Product, hostedProduct } from "./products";

// Fixed width only in the desktop panel's columns; the mobile and tablet menu
// (below lg) stretches cards across the row.
const cardClass =
  "block w-full rounded-lg border border-white/10 bg-ocean-800 p-5 hover:bg-ocean-700 lg:w-[327px]";

function dataCy(name: string): string {
  return `nav-product-${name.toLowerCase().replace(/\s/g, "-")}`;
}

export function ProductCard(props: Product) {
  return (
    <a href={props.href} className={cardClass} data-cy={dataCy(props.name)}>
      <span className="flex items-start gap-3.5">
        <img src={props.icon} alt="" className="h-10 w-10 shrink-0" />
        <span className="flex flex-col gap-1 leading-[normal]">
          <span className="text-base font-semibold text-white">
            {props.name}
          </span>
          <span className="text-[13px] text-stone-300">
            {props.description}
          </span>
        </span>
      </span>
    </a>
  );
}

export function HostedCard({ className }: { className?: string }) {
  return (
    <div
      className={[
        // Side by side on tablet, stacked on phone and in the desktop column.
        "flex w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-ocean-800 hover:bg-ocean-700 md:max-lg:flex-row lg:w-[327px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-cy={dataCy(hostedProduct.name)}
    >
      <a
        href={hostedProduct.href}
        className="relative flex h-[140px] w-full shrink-0 items-center justify-center overflow-hidden bg-space-700 md:max-lg:w-[327px]"
      >
        <img
          src={images.backgrounds.hostedCloud}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src={images.logos.hostedDolt}
          alt="Hosted Dolt"
          className="relative h-6 w-auto"
        />
      </a>
      <span className="flex w-full flex-col gap-3 p-5 leading-[normal] md:max-lg:justify-center md:max-lg:px-12">
        <a
          href={hostedProduct.href}
          className="text-base font-semibold text-white"
        >
          {hostedProduct.name}
        </a>
        <span className="text-[13px] text-stone-300">
          {hostedProduct.description}
        </span>
        <a
          href={hostedProduct.ctaHref}
          className="text-[13px] font-semibold text-sky-400"
        >
          {hostedProduct.cta}
        </a>
      </span>
    </div>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm uppercase tracking-wide text-stone-300">{children}</p>
  );
}
