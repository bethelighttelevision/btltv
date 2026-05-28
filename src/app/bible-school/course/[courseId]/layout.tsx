import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course - BTL TV Bible School",
  robots: "noindex, nofollow",
};

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
