import ContactContent from "./ContactContent";
import { getPageContent } from "@/lib/public-data";

export async function generateMetadata() {
  const content = await getPageContent("contact");
  return {
    title: content.pageTitle || "Contact Us - BTL TV",
    description: content.metaDescription || "Get in touch with BTL TV. Reach us via email, phone, WhatsApp, or social media.",
    openGraph: content.ogImage ? { images: [content.ogImage] } : undefined,
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
