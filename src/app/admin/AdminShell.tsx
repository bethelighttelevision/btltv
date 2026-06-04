"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Home,
  ChevronDown,
  Menu,
  X,
  Smartphone,
  Settings,
  ChevronRight,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import AdminGuard from "@/components/AdminGuard";
import { useState } from "react";

const nav = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    desc: "Overview & stats",
  },
  {
    href: "/admin/courses",
    label: "Courses",
    icon: BookOpen,
    desc: "Manage courses & lessons",
    badge: "6",
    children: [
      { href: "/admin/courses", label: "All Courses" },
    ],
  },
  {
    href: "/admin",
    label: "App Downloads",
    icon: Smartphone,
    desc: "Analytics & reports",
    disabled: true,
  },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["/admin/courses"]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const toggleMenu = (href: string) => {
    setExpandedMenus((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isChildActive = (children: { href: string }[]) =>
    children.some((c) => pathname.startsWith(c.href));

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0a0a0a] flex">
        {/* ─── Sidebar ─── */}
        <aside className="w-60 lg:w-64 shrink-0 bg-[#111] border-r border-white/[0.06] hidden md:flex flex-col">
          {/* Logo */}
          <div className="px-4 lg:px-5 pt-5 pb-4 border-b border-white/[0.06]">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-lg bg-btl-red flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform shadow-lg shadow-btl-red/20">
                B
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-tight tracking-tight">BTL TV</div>
                <div className="text-[10px] text-gray-500">Admin Panel</div>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-2 lg:px-3 py-3 space-y-0.5">
            {nav.map((item) => {
              const active = item.disabled ? false : isActive(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const expanded = expandedMenus.includes(item.href);
              const childActive = hasChildren && isChildActive(item.children!);

              if (item.disabled) {
                return (
                  <div
                    key={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 cursor-not-allowed opacity-50"
                  >
                    <div className="h-7 w-7 rounded-lg bg-white/[0.03] flex items-center justify-center">
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium">{item.label}</div>
                      <div className="text-[9px] text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.href}>
                  <Link
                    href={hasChildren ? "#" : item.href}
                    onClick={hasChildren ? (e) => { e.preventDefault(); toggleMenu(item.href); } : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                      active || childActive
                        ? "bg-btl-red/10 text-btl-red"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                        active || childActive ? "bg-btl-red/20" : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium">{item.label}</div>
                      <div className="text-[9px] text-gray-500 truncate">{item.desc}</div>
                    </div>
                    {item.badge && (
                      <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-btl-red/20 text-btl-red text-[9px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {hasChildren && (
                      <ChevronRight
                        className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`}
                      />
                    )}
                  </Link>

                  {hasChildren && expanded && (
                    <div className="ml-9 mt-0.5 space-y-0.5">
                      {item.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-1.5 rounded text-[11px] transition-colors ${
                            pathname === child.href
                              ? "text-btl-red bg-btl-red/10"
                              : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="border-t border-white/[0.06] px-2 lg:px-3 py-3 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              <div className="h-7 w-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <Home className="h-3.5 w-3.5" />
              </div>
              <span>View Website</span>
            </Link>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
              <div className="h-7 w-7 rounded-full bg-btl-red/20 flex items-center justify-center text-[10px] text-btl-red font-bold uppercase">
                {session?.user?.name?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white font-medium truncate leading-tight">{session?.user?.name || "Admin"}</div>
                <div className="text-[9px] text-gray-500 truncate">{session?.user?.email}</div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-500 hover:text-red-400 transition-colors p-1 shrink-0"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* ─── Mobile Header ─── */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111] border-b border-white/[0.06] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="text-gray-400 hover:text-white p-1">
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-btl-red flex items-center justify-center text-white font-bold text-xs">B</div>
              <span className="text-sm font-bold text-white">BTL Admin</span>
            </Link>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white p-1">
            <Home className="h-5 w-5" />
          </Link>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)}>
            <div
              className="fixed left-0 top-14 bottom-0 w-64 bg-[#111] border-r border-white/[0.06] p-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-0.5">
                {nav.map((item) => {
                  const active = item.disabled ? false : isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.disabled ? "#" : item.href}
                      onClick={() => !item.disabled && setMobileNavOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                        active ? "text-btl-red bg-btl-red/10" : item.disabled ? "text-gray-600 cursor-not-allowed" : "text-gray-400"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="border-t border-white/[0.06] mt-4 pt-4">
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileNavOpen(false); }}
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-red-400 w-full px-3 py-2.5"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Content ─── */}
        <main className="flex-1 min-h-screen overflow-auto bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-6 pb-24 md:pb-10">
            {/* Admin Bar */}
            <div className="hidden md:flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Link href="/" className="hover:text-gray-300 transition-colors">BTL TV</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-300 font-medium">Admin</span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Home className="h-3 w-3" />
                  View Site
                </Link>
                <div className="h-4 w-px bg-white/[0.06]" />
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
