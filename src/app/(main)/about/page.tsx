import AboutContent from "./AboutContent";
import { getPageContent } from "@/lib/public-data";

export async function generateMetadata() {
  const content = await getPageContent("about");
  return {
    title: content.pageTitle || "About Us - BTL TV",
    description: content.metaDescription || "BTL TV is a Christian faith-based media platform broadcasting in Urdu. Learn about our mission to spread the Gospel to Pakistani-speaking communities worldwide.",
    openGraph: content.ogImage ? { images: [content.ogImage] } : undefined,
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
