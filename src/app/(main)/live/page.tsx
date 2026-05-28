import LiveContent from "./LiveContent";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata(
  "Live TV",
  "Watch BTL TV live 24/7. Live Christian television broadcasting in Urdu with devotional programs, talk shows, dramas, and more.",
  "/live"
);

export default function LiveTVPage() {
  return <LiveContent />;
}
