import DonationContent from "./DonationContent";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata(
  "Donation",
  "Support BTL TV's ministry. Donate to help us produce Christian content in Urdu and reach Pakistani-speaking communities worldwide.",
  "/donation"
);

export default function DonationPage() {
  return <DonationContent />;
}
