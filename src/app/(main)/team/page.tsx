"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Briefcase, Mic, BookOpen, Gavel, Users } from "lucide-react";
import { TEAM_GROUPS } from "@/lib/site-data";

export default function TeamPage() {
  return (
    <div className="min-h-screen px-4 md:px-6 py-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Our Team</h1>
        <p className="text-muted-foreground">The people behind BTL TV who make it all possible.</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {TEAM_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
                <group.icon className="h-5 w-5 text-btl-red" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{group.title}</h2>
                <div className="h-0.5 w-16 bg-btl-red/50 rounded mt-1" />
              </div>
            </div>
            <div className={`grid gap-4 md:gap-5 ${group.members.length <= 2
                ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : group.members.length <= 4
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              }`}>
              {group.members.map((member) => (
                <motion.div
                  key={member.name}
                  whileHover={{ y: -4 }}
                  className="cursor-default"
                >
                  <div className="overflow-hidden rounded-lg bg-btl-card hover:ring-1 hover:ring-btl-red/30 transition-all">
                    <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'white' }}>
                      <img
                        src={member.image}
                        alt={member.name}
                        width={500}
                        height={500}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/logo/btl-logo.webp";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-btl-card via-transparent to-transparent" />
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-semibold text-xs sm:text-sm text-foreground truncate">{member.name}</h3>
                      <p className="text-[10px] sm:text-xs text-btl-red mt-0.5 font-medium">{member.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
