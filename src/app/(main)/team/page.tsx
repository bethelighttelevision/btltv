import TeamContent from "./TeamContent";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata(
  "Our Team",
  "Meet the team behind BTL TV — leadership, hosts, pastors, and volunteers dedicated to spreading the Gospel in Urdu.",
  "/team"
);

export default function TeamPage() {
  return <TeamContent />;
}
