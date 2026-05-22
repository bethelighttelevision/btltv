import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard - BTL TV Bible School",
  description: "Track your progress in Bible School courses. Continue where you left off and earn certificates.",
  robots: "noindex, nofollow",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
