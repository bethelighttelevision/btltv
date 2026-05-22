import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings - BTL TV Bible School",
  description: "Edit your profile name, email, and password for your BTL TV Bible School account.",
  robots: "noindex, nofollow",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
