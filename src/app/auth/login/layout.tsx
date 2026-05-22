import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - BTL TV Bible School",
  description: "Sign in to your BTL TV Bible School account to access free Urdu Bible courses.",
  robots: "noindex, nofollow",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
