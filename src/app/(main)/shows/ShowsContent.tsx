"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface DBShow { id: string; title: string; slug: string; category: string; thumbnail: string | null; description: string | null; }

function ShowsContentInner() {
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [programs, setPrograms] = useState<DBShow[] | null>(null);
  const [categories, setCategories] = useState<Record<string, { label: string }>>({});

  useEffect(() => {
    fetch("/api/public?page=shows", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.shows && Array.isArray(data.shows)) {
          setPrograms(data.shows);
          const cats: Record<string, { label: string }> = {};
          data.shows.forEach((s: DBShow) => { if (!cats[s.category]) cats[s.category] = { label: s.category }; });
          setCategories(cats);
        }
      })
      .catch(() => setPrograms([]));
  }, []);

  const allCategories = ["ALL", ...Object.keys(categories)];
  const filtered = (programs || []).filter((p) => {
    const matchCategory = filterCategory === "ALL" || p.category === filterCategory;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (!programs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-6 py-6">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">All Shows</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search shows..." className="pl-10 bg-white/5 border-border/50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allCategories.map((cat) => (
            <Button key={cat} variant={filterCategory === cat ? "default" : "outline"} size="sm"
              className={filterCategory === cat ? "bg-btl-red hover:bg-btl-red-dark text-white" : "border-border/50 text-muted-foreground hover:text-foreground"}
              onClick={() => setFilterCategory(cat)}>
              {cat === "ALL" ? "All" : categories[cat]?.label || cat}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {filtered.map((program) => (
          <motion.div key={program.id} whileHover={{ y: -4 }} className="cursor-pointer" onClick={() => router.push(`/shows/${program.slug}`)}>
            <div className="overflow-hidden rounded-md bg-btl-card hover:ring-1 hover:ring-btl-red/30 transition-all">
              <div className="relative aspect-video overflow-hidden">
                <img src={program.thumbnail || "/images/programs/placeholder.webp"} alt={program.title} width={320} height={180} loading="lazy" decoding="async" sizes="(max-width: 640px) 160px, 220px" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-1.5 left-1.5 bg-btl-red/90 text-white text-[9px] font-bold px-1.5 py-0">{program.category}</Badge>
              </div>
              <div className="p-2"><h3 className="font-medium text-[11px] sm:text-xs text-foreground truncate">{program.title}</h3></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ShowsContent() {
  return <ShowsContentInner />;
}
