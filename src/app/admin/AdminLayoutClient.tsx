"use client";

import { usePathname } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/admin/login" || pathname === "/admin/signup";

  if (isPublicPage) return <>{children}</>;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <div className="ml-60">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
