import KidsContent from "./KidsContent";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata(
  "BTL Kids",
  "Fun and faith-filled Christian programs for children in Urdu. Bible stories, kids worship, and educational content for kids.",
  "/kids"
);

export default function KidsPage() {
  return <KidsContent />;
}
