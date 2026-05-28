import DonationContent from "./DonationContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate to BTL TV — Official Netherlands-Based Urdu Christian TV",
  description:
    "Support the ministry of BTL TV (Stichting Be The Light Television), a Netherlands-registered ANBI foundation producing Urdu Christian television content. Official donations via Geef.nl. Beware of impersonators.",
  alternates: { canonical: "https://btl-tv.com/donation" },
  openGraph: {
    title: "Donate to BTL TV — Official Netherlands-Based Urdu Christian TV",
    description:
      "Support the ministry of BTL TV (Stichting Be The Light Television), a Netherlands-registered ANBI foundation producing Urdu Christian television content.",
    url: "https://btl-tv.com/donation",
    images: [{ url: "/images/btl-logo.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Donate to BTL TV — Official Netherlands-Based Urdu Christian TV",
    description:
      "Support Stichting Be The Light Television. Official donations via Geef.nl.",
    images: ["/images/btl-logo.webp"],
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Stichting Be The Light Television",
      alternateName: "BTL TV",
      description: "Netherlands-based Urdu Christian television ministry",
      url: "https://btl-tv.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Westeinde 21",
        addressLocality: "Zwartsluis",
        postalCode: "8064 AJ",
        addressCountry: "NL",
      },
      identifier: [
        { "@type": "PropertyValue", name: "KvK", value: "68202377" },
        { "@type": "PropertyValue", name: "ANBI", value: "857342423" },
      ],
      sameAs: [
        "https://www.youtube.com/@btltv",
        "https://www.facebook.com/btltv",
        "https://www.instagram.com/btltv",
        "https://soundcloud.com/user-549013936",
      ],
    }),
  },
};

export default function DonationPage() {
  return <DonationContent />;
}
