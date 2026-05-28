"use client";

import Link from "next/link";
import { Youtube, Facebook, Instagram, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS } from "@/lib/site-data";

export default function Footer() {
  const getHref = (key: string) => {
    if (key === "home") return "/";
    if (key === "bible-school") return "/bible-school";
    return `/${key}`;
  };

  return (
    <footer className="bg-btl-darker border-t border-border/20 py-3 md:py-6 mt-auto">
      <div className="px-4 md:px-6 max-w-6xl mx-auto">
        {/* Mobile: ultra-compact horizontal layout */}
        <div className="md:hidden space-y-2">
          <div className="flex items-center justify-between">
            <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-5 w-auto object-contain eternal-flame" />
            <div className="flex gap-2">
              <button className="text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.youtube.com/@btltv", "_blank")}>
                <Youtube className="h-4 w-4" />
              </button>
              <button className="text-muted-foreground hover:text-[#ff5500]" onClick={() => window.open("https://soundcloud.com/user-549013936", "_blank")}>
                <Disc3 className="h-4 w-4" />
              </button>
              <button className="text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.facebook.com/btltv", "_blank")}>
                <Facebook className="h-4 w-4" />
              </button>
              <button className="text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.instagram.com/btltv", "_blank")}>
                <Instagram className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {NAV_LINKS.map((link) => (
              <Link key={link.key} href={getHref(link.key)} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-[9px] text-muted-foreground leading-tight">
            Westeinde 21, 8064 AJ Zwartsluis, NL · info@btl-tv.com
          </p>
        </div>

        {/* Desktop footer */}
        <div className="hidden md:grid grid-cols-4 gap-6 mb-6">
          <div>
            <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-8 w-auto object-contain mb-3 eternal-flame" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Be The Light Television — spreading the Gospel of Jesus Christ to Urdu-speaking communities worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Navigation</h4>
            <div className="space-y-1.5">
              {NAV_LINKS.slice(0, 4).map((link) => (
                <Link key={link.key} href={getHref(link.key)} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">More</h4>
            <div className="space-y-1.5">
              {NAV_LINKS.slice(4).map((link) => (
                <Link key={link.key} href={getHref(link.key)} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Contact</h4>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>Westeinde 21, 8064 AJ</p>
              <p>Zwartsluis, Netherlands</p>
              <a href="mailto:info@btl-tv.com" className="hover:text-foreground transition-colors">info@btl-tv.com</a>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.youtube.com/@btltv", "_blank")}>
                <Youtube className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-[#ff5500]" onClick={() => window.open("https://soundcloud.com/user-549013936", "_blank")}>
                <Disc3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.facebook.com/btltv", "_blank")}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.instagram.com/btltv", "_blank")}>
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Separator className="bg-border/20 mb-3 md:mb-4" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] md:text-[11px] text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Stichting Be The Light Television. All rights reserved.</p>
          <p>ANBI RSIN: 857342423 | KvK: 68202377</p>
        </div>
      </div>
    </footer>
  );
}
