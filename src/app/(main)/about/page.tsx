import AboutContent from "./AboutContent";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata(
  "About Us",
  "BTL TV is a Christian faith-based media platform broadcasting in Urdu. Learn about our mission to spread the Gospel to Pakistani-speaking communities worldwide.",
  "/about",
  "/images/about/about-banner.webp"
);

export default function AboutPage() {
  return <AboutContent />;
}
