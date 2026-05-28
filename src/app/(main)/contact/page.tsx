import ContactContent from "./ContactContent";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata(
  "Contact Us",
  "Get in touch with BTL TV. Reach us via email, phone, WhatsApp, or social media. We'd love to hear from you.",
  "/contact"
);

export default function ContactPage() {
  return <ContactContent />;
}
