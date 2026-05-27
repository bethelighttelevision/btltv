"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Cross, Sparkles, Tv, Play, Flame, BookMarked, BookOpen, Building2, Users, Baby, Heart, FileText, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { BeforeInstallPromptEvent, NAV_LINKS } from "@/lib/site-data";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const detectPWA = () => {
      const ua = navigator.userAgent;
      const ios = /iPad|iPhone|iPod/.test(ua);
      setIsIos(ios);
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
      if (ios && !standalone) {
        const dismissed = sessionStorage.getItem('btl-ios-install-dismissed');
        if (!dismissed) setShowIosInstall(true);
      }
    };
    requestAnimationFrame(detectPWA);
    const handler = (e: Event) => {
      e.preventDefault();
      setPwaInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const getHref = (key: string) => {
    if (key === "home") return "/";
    if (key === "bible-school") return "/bible-school";
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
          <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-8 w-auto object-contain" />
        </Link>

        {pwaInstallPrompt && !isStandalone && (
          <Button
            className="hidden md:flex bg-btl-red hover:bg-btl-red-dark text-white text-xs h-8 px-3 mr-2"
            onClick={async () => {
              await pwaInstallPrompt.prompt();
              setPwaInstallPrompt(null);
            }}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Install App
          </Button>
        )}
        {isIos && !isStandalone && showIosInstall && (
          <Button
            className="hidden md:flex bg-btl-red hover:bg-btl-red-dark text-white text-xs h-8 px-3 mr-2"
            onClick={() => {
              toast.info('Tap the Share button (⬆) in Safari, then "Add to Home Screen"');
            }}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Install App
          </Button>
        )}

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.key);
            return (
              <Link
                key={link.key}
                href={getHref(link.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${active
                    ? "bg-btl-red text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
              >
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
                  <Link
                    key={link.key}
                    href={getHref(link.key)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active
                        ? "bg-btl-red text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              {pwaInstallPrompt && !isStandalone && (
                <button
                  onClick={async () => {
                    await pwaInstallPrompt.prompt();
                    setPwaInstallPrompt(null);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-btl-red text-white mt-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Install App
                </button>
              )}
              {isIos && !isStandalone && showIosInstall && (
                <button
                  onClick={() => {
                    toast.info('Tap the Share button (⬆) in Safari, then "Add to Home Screen"');
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-btl-red text-white mt-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Install App
                </button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
