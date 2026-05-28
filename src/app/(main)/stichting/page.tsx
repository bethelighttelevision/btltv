import StichtingContent from "./StichtingContent";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata(
  "Stichting Be The Light Television",
  "Stichting BTL TV is an ANBI-registered foundation in the Netherlands. Learn about our mission, board, and financial transparency.",
  "/stichting",
  "/images/stichting/anbi-logo.webp"
);

export default function StichtingPage() {
  return <StichtingContent />;
}
