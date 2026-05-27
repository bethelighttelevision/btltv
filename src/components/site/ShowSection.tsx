"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgramCard from "./ProgramCard";

interface Program {
  id: string;
  title: string;
  poster: string;
  category: string;
  description: string;
}

function ShowSection({
  title,
  icon: Icon,
  programs,
  sectionKey,
  scrollContainer,
  onSelectShow,
}: {
  title: string;
  icon: React.ElementType;
  programs: Program[];
  sectionKey: string;
  scrollContainer: (key: string, dir: "left" | "right") => void;
  onSelectShow: (id: string) => void;
}) {
  return (
    <section className="py-5 md:py-6">
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-btl-red" />
            <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => scrollContainer(sectionKey, "left")}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => scrollContainer(sectionKey, "right")}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div
          id={`scroll-${sectionKey}`}
          className="flex gap-3 overflow-x-auto hide-scrollbar smooth-scroll pb-2"
        >
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onClick={() => onSelectShow(program.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShowSection;
