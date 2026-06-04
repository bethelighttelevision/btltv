import KidsContent from "./KidsContent";
import { getPageContent } from "@/lib/public-data";

export async function generateMetadata() {
  const content = await getPageContent("kids");
  return {
    title: content.pageTitle || "BTL Kids - BTL TV",
    description: content.metaDescription || "Fun and faith-filled Christian programs for children in Urdu. Bible stories, kids worship, and educational content.",
    openGraph: content.ogImage ? { images: [content.ogImage] } : undefined,
  };
}

export default function KidsPage() {
  return <KidsContent />;
}
