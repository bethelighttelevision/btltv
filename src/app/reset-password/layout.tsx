import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - BTL TV Bible School",
  description: "Set a new password for your BTL TV Bible School account.",
  robots: "noindex, nofollow",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
