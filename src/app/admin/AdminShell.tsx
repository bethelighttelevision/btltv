"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, ArrowLeft, LogOut, Home, ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import AdminGuard from "@/components/AdminGuard";
import { useState } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, desc: "Overview & stats" },
  { href: "/admin/courses", label: "Courses", icon: BookOpen, desc: "Manage courses & lessons" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0a0a0a] flex">
        {/* ─── Sidebar ─── */}
        <aside className="w-64 shrink-0 bg-gradient-to-b from-[#111] to-[#0d0d0d] border-r border-white/[0.06] p-5 hidden md:flex flex-col">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3 mb-10 px-1 group">
            <div className="h-9 w-9 rounded-lg bg-btl-red flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
              B
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight">BTL Admin</div>
              <div className="text-[11px] text-gray-500">Management Panel</div>
            </div>
          </Link>

          {/* Nav */}
          <nav className="space-y-1 flex-1">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                    active
                      ? "bg-btl-red/10 text-btl-red border border-btl-red/20"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${active ? "bg-btl-red/20" : "bg-white/[0.04]"}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-[10px] text-gray-500">{item.desc}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="space-y-1.5 border-t border-white/[0.06] pt-4">
            <Link href="/bible-school" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all">
              <div className="h-7 w-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <Home className="h-3.5 w-3.5" />
              </div>
              <span>View Site</span>
            </Link>
            <div className="px-3 py-2.5 flex items-center gap-3 border-t border-white/[0.04] pt-3 mt-1">
              <div className="h-8 w-8 rounded-full bg-btl-red/20 flex items-center justify-center text-xs text-btl-red font-bold uppercase">
                {session?.user?.name?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white font-medium truncate">{session?.user?.name || "Admin"}</div>
                <div className="text-[10px] text-gray-500 truncate">{session?.user?.email}</div>
              </div>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-500 hover:text-red-400 transition-colors p-1" title="Sign Out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ─── Mobile Header ─── */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111]/95 backdrop-blur-md border-b border-white/[0.06] px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-white">
            <div className="h-7 w-7 rounded-md bg-btl-red flex items-center justify-center text-white font-bold text-xs">B</div>
            <span className="text-sm">BTL Admin</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/bible-school" className="text-gray-400 hover:text-white p-2">
              <Home className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              <ChevronDown className={`h-5 w-5 transition-transform ${mobileNavOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-[#111]/95 backdrop-blur-md border-b border-white/[0.06] px-4 py-3 space-y-1">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                    active ? "text-btl-red bg-btl-red/10" : "text-gray-400"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 w-full">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        )}

        {/* ─── Content ─── */}
        <main className="flex-1 min-h-screen overflow-auto">
          <div className="max-w-6xl mx-auto px-4 md:px-8 pt-20 md:pt-10 pb-24 md:pb-10">
            {/* Breadcrumb / Back */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
              <Link href="/bible-school" className="hover:text-white transition-colors">Site</Link>
              <span>/</span>
              <span className="text-gray-300">Admin</span>
            </div>
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
