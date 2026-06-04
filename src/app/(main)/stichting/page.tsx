import StichtingContent from "./StichtingContent";
import { getPageContent } from "@/lib/public-data";

export async function generateMetadata() {
  const content = await getPageContent("stichting");
  return {
    title: content.pageTitle || "Stichting Be The Light Television - BTL TV",
    description: content.metaDescription || "Stichting BTL TV is an ANBI-registered foundation in the Netherlands.",
    openGraph: content.ogImage ? { images: [content.ogImage] } : undefined,
  };
}

export default function StichtingPage() {
  return <StichtingContent />;
}
