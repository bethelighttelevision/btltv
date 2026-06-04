"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Tv, Users, Video, Radio, BookOpen,
  Settings, LogOut, ChevronDown, Download, MessageSquare,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  {
    label: "Shows & Programs", icon: Tv,
    children: [
      { href: "/admin/shows", label: "All Shows" },
      { href: "/admin/shows/new", label: "Add New Show" },
    ],
  },
  {
    label: "Videos", icon: Video,
    children: [
      { href: "/admin/videos", label: "All Videos" },
    ],
  },
  { href: "/admin/live-tv", label: "Live TV", icon: Radio },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  {
    label: "Pages", icon: BookOpen,
    children: [
      { href: "/admin/pages/home", label: "Home Page" },
      { href: "/admin/pages/about", label: "About Page" },
      { href: "/admin/pages/stichting", label: "Stichting Page" },
      { href: "/admin/pages/kids", label: "Kids Page" },
      { href: "/admin/pages/contact", label: "Contact Page" },
    ],
  },
  {
    label: "Settings", icon: Settings,
    children: [
      { href: "/admin/settings/general", label: "General Settings" },
      { href: "/admin/settings/seo", label: "SEO Settings" },
      { href: "/admin/settings/profile", label: "Profile" },
      { href: "/admin/settings/password", label: "Change Password" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0d0d0d] border-r border-white/[0.04] overflow-y-auto z-50">
      <div className="p-4 border-b border-white/[0.04]">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-btl-red flex items-center justify-center text-white font-bold text-sm">B</div>
          <div>
            <div className="text-white text-sm font-semibold leading-tight">BTL TV</div>
            <div className="text-[10px] text-gray-500">Admin Panel</div>
          </div>
        </Link>
      </div>
      <nav className="p-2 space-y-0.5">
        {navItems.map((item) => {
          if ("children" in item && item.children) {
            const isExpanded = expanded.includes(item.label);
            const anyChildActive = item.children.some((c) => isActive(c.href));
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                    anyChildActive ? "text-white bg-white/[0.04]" : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="ml-6 mt-0.5 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          isActive(child.href) ? "text-btl-red bg-btl-red/10" : "text-gray-500 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                isActive(item.href!, item.exact) ? "text-white bg-white/[0.04]" : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-white/[0.04] mt-2">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
