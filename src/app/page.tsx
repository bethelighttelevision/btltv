import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import HomeDemo from "@/components/site/HomeDemo";

export const metadata: Metadata = {
  title: "BTL TV — Be The Light Television",
  description:
    "Watch Christian TV programs in Urdu on BTL TV. Live TV, devotional shows, talk shows, dramas, kids programs, and the complete Urdu Audio Bible.",
  openGraph: {
    title: "BTL TV — Be The Light Television",
    description:
      "Urdu Christian television broadcasting worldwide. Watch live TV, 40+ shows, kids programs, and listen to the Urdu Audio Bible — free.",
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white antialiased">
      <Header />
      {/* Pull the hero under the floating glass pill so no black gap sits between nav and Jesus */}
      <div className="-mt-[60px] md:-mt-16">
        <HomeDemo />
      </div>
      <Footer />
    </div>
  );
}
