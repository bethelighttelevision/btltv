"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/site-data";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getHref = (key: string) => {
    if (key === "home") return "/";
    return `/${key}`;
  };

  const isActive = (key: string) => {
    if (key === "home") return pathname === "/";
    return pathname === `/${key}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-btl-darker/95 backdrop-blur-md border-b border-border/30">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-8 w-auto object-contain eternal-flame" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.key);
            return (
              <Link key={link.key} href={getHref(link.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${active ? "bg-btl-red text-white" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-btl-darker border-border/30">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-1 mt-6">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mb-4">
                <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-10 w-auto object-contain" />
              </Link>
              {NAV_LINKS.map((link) => {
                const active = isActive(link.key);
                return (
                  <Link key={link.key} href={getHref(link.key)} onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? "bg-btl-red text-white" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}

            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
