import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - BTL TV",
  description: "Manage courses, lessons, and quizzes for BTL TV Bible School.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
