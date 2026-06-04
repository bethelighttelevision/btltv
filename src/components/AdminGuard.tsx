"use client";

import { useSession } from "next-auth/react";
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/auth/login";
    } else if (status === "authenticated" && (session.user as any).role !== "admin") {
      window.location.href = "/bible-school";
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
      </div>
    );
  }

  if (status === "unauthenticated" || (session?.user && (session.user as any).role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}
