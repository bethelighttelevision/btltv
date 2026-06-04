import type { Metadata } from "next";
import MainLayoutClient from "./MainLayoutClient";

export const metadata: Metadata = {
  title: "BTL TV — Be The Light Television",
  description: "Watch Christian TV programs in Urdu on BTL TV. Live TV, devotional shows, talk shows, dramas, kids programs, and the complete Urdu Audio Bible.",
  openGraph: {
    title: "BTL TV — Be The Light Television",
    description: "Urdu Christian television broadcasting worldwide. Watch live TV, 40+ shows, kids programs, and listen to the Urdu Audio Bible — free.",
    type: "website",
    siteName: "BTL TV",
    locale: "ur_PK",
    images: [{ url: "/images/btl-logo.webp", width: 1200, height: 630, alt: "BTL TV" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTL TV — Be The Light Television",
    description: "Urdu Christian television — live TV, shows, and Urdu Audio Bible.",
    images: ["/images/btl-logo.webp"],
  },
  robots: { index: true, follow: true },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <MainLayoutClient>{children}</MainLayoutClient>;
}
