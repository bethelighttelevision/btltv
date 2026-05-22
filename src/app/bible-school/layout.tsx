import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bible School - Free Online Urdu Bible Courses | BTL TV",
  description: "Learn the Bible in Urdu with free online courses from BTL TV Bible School. Start with Bible Basics and other foundational Christian courses.",
  openGraph: {
    title: "Bible School - BTL TV",
    description: "Free online Urdu Bible courses to deepen your faith.",
    url: "https://btl-tv.com/bible-school",
  },
};

export default function BibleSchoolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
