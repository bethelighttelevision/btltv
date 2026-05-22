import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - BTL TV Bible School",
  description: "Create a free account to access BTL TV Bible School courses and track your learning progress.",
  robots: "noindex, nofollow",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
