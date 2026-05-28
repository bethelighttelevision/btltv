import type { Metadata } from "next";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  ogImage?: string
): Metadata {
  return {
    title: `${title} — BTL TV`,
    description,
    alternates: { canonical: `https://btl-tv.com${path}` },
    openGraph: {
      title: `${title} — BTL TV`,
      description,
      url: `https://btl-tv.com${path}`,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630 }]
        : [{ url: "/images/btl-logo.webp", width: 1200, height: 630 }],
    },
    twitter: {
      title: `${title} — BTL TV`,
      description,
      images: ogImage ? [ogImage] : ["/images/btl-logo.webp"],
    },
  };
}
