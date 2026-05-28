import ShowsContent from "./ShowsContent";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata(
  "Shows",
  "Browse BTL TV's complete catalog of Christian programs in Urdu. Watch devotional, talk shows, dramas, documentaries, and more.",
  "/shows"
);

export default function ShowsPage() {
  return <ShowsContent />;
}
