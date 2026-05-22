import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - BTL TV Bible School",
  description: "Reset your BTL TV Bible School account password. Enter your email to receive a reset link.",
  robots: "noindex, nofollow",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
