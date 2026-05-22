"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, ArrowLeft, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import AdminGuard from "@/components/AdminGuard";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0a0a0a] flex">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-[#111] border-r border-white/5 p-4 hidden md:flex flex-col">
          <Link href="/admin" className="text-lg font-bold text-white mb-8 mt-2 px-3">
            <span className="text-btl-red">BTL</span> Admin
          </Link>
          <nav className="space-y-1 flex-1">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active ? "bg-btl-red/10 text-btl-red" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-1 border-t border-white/5 pt-3">
            <Link href="/bible-school" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Site
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111] border-b border-white/5 px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="font-bold text-white">
            <span className="text-btl-red">BTL</span> Admin
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/bible-school" className="text-gray-400 hover:text-white p-2">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-400 hover:text-white p-2">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/5 flex">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`flex-1 flex flex-col items-center py-2 text-xs ${active ? "text-btl-red" : "text-gray-500"}`}>
                <item.icon className="h-5 w-5 mb-0.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 pb-20 md:pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="md:hidden mb-4">
              <Link href="/bible-school" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Main Site
              </Link>
            </div>
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
