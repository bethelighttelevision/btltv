import ReportsContent from "./ReportsContent";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata(
  "Reports",
  "Annual reports and financial statements of Stichting Be The Light Television (ANBI-registered foundation). Transparent financial reporting.",
  "/reports"
);

export default function ReportsPage() {
  return <ReportsContent />;
}
