"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handler = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-btl-dark">
      <Header />
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        {children}
        <Footer />
      </main>

      {showScrollTop && (
        <button
          onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full bg-btl-red text-white shadow-lg flex items-center justify-center hover:bg-btl-red-dark transition-all"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
