"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Landmark, Sparkles, Tv, Users, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function StichtingPage() {
  return (
    <div className="min-h-screen">
      {/* Professional Header Banner */}
      <div className="relative w-full overflow-hidden">
        <div className="bg-gradient-to-br from-btl-dark via-btl-dark to-btl-dark py-16 md:py-24 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <img
                  src="/images/stichting/anbi-logo.webp"
                  alt="ANBI Certified"
                  width={200}
                  height={147}
                  loading="lazy"
                  className="h-24 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-btl-red/50" />
                <Building2 className="h-8 w-8 text-btl-red" />
                <div className="h-px w-12 bg-btl-red/50" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Stichting Be The Light Television
              </h1>
              <p className="text-white/50 text-sm uppercase tracking-[0.25em]">
                Registered Foundation — The Netherlands
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Foundation Details - Professional Table */}
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <Landmark className="h-5 w-5 text-btl-red" />
                <h2 className="text-lg md:text-xl font-bold text-foreground">Foundation Details</h2>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {[
                  { label: "RSIN Number", value: "857342423" },
                  { label: "KvK Number", value: "68202377" },
                  { label: "IBAN Number", value: "NL06 RABO 0317 1209 80" },
                  { label: "Postal Address", value: "Westeinde 21, 8064 AJ Zwartsluis, The Netherlands" },
                  { label: "Date of Establishment", value: "March 2, 2017" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col sm:flex-row px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    <span className="text-sm text-muted-foreground sm:w-48 shrink-0 font-medium">{item.label}</span>
                    <span className="text-sm text-foreground font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Purpose */}
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-btl-red" />
                <h2 className="text-lg md:text-xl font-bold text-foreground">Purpose of the Foundation</h2>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed text-base">
                Stichting Be The Light Television aims to reach the Urdu-speaking population worldwide with the
                Gospel of Jesus Christ and to empower them to have a positive influence in their communities.
              </p>
            </CardContent>
          </Card>

          {/* How We Achieve Our Goal */}
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <Tv className="h-5 w-5 text-btl-red" />
                <h2 className="text-lg md:text-xl font-bold text-foreground">How We Achieve Our Goal</h2>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The foundation strives to achieve its mission by producing and broadcasting television programs
                in the form of talk shows, presentations, and dramatized programs. These are shared via the
                internet, social media, and (satellite) television.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                BTL-tv also aims to provide a platform for Christian artists, enabling them to use their unique
                gifts and talents for the Kingdom of God.
              </p>

              <div className="bg-btl-dark/50 rounded-lg p-5 mt-4">
                <h4 className="text-sm font-semibold text-btl-red uppercase tracking-wider mb-3">Income Sources</h4>
                <ul className="space-y-2.5">
                  {[
                    "Collections in church services",
                    "Speaking engagements and presentations about BTL-tv's work",
                    "Structural donations from supporting companies and individuals",
                    "Flyer campaigns to attract new donors",
                    "Donations made through the donation button on the website",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-btl-red mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-muted-foreground leading-relaxed mt-4">
                All income is used to support the work of BTL-tv, including investments in new cameras, video
                and audio technology. Some volunteers may receive reimbursements for expenses incurred while
                working for BTL-tv. Additionally, costs for online streaming and satellite broadcasting are covered.
              </p>
            </CardContent>
          </Card>

          {/* Board Composition */}
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-btl-red" />
                <h2 className="text-lg md:text-xl font-bold text-foreground">Board Composition</h2>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid gap-4 mb-6">
                {[
                  { name: "Mr. J. van der Stouwe", role: "Chairman" },
                  { name: "Mr. D. Ras", role: "Secretary" },
                  { name: "Mr. W. Bakker", role: "Treasurer / General Board Member" },
                ].map((member) => (
                  <div key={member.name} className="flex items-center gap-4 p-3 rounded-lg bg-btl-dark/30 hover:bg-btl-dark/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-btl-red/10 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-btl-red" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-btl-red font-medium">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Board members are elected for a minimum of two years, with the possibility of re-election.
                  The board meets at least six times a year, and its responsibilities include:
                </p>
                <ul className="space-y-2">
                  {[
                    "Supervising the leadership of BTL-tv",
                    "Approving policies, budgets, the annual report, and financial statements",
                    "Advising BTL-tv management on specific areas of expertise",
                    "Representing BTL-tv to donors and partner organizations with similar goals",
                    "Encouraging and supporting permanent staff and volunteers",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-btl-red mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Compensation Policy */}
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-btl-red" />
                <h2 className="text-lg md:text-xl font-bold text-foreground">Compensation Policy</h2>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                None of the board members receive financial compensation for their work with Stichting Be The
                Light Television. Employees and volunteers of BTL-tv also do not receive a salary for their work.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                BTL-tv relies on the services of various volunteers from the Christian Pakistani community in
                the Netherlands. None of these staff or volunteers receive salaries. Income of the foundation
                is used solely for expense reimbursements, such as travel allowances and volunteer contributions.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-4">
            <Link href="/donation">
              <Button className="bg-btl-red hover:bg-btl-red-dark text-white font-semibold px-8 min-h-[44px]">
                <Heart className="h-4 w-4 mr-2 fill-current" />
                Support Our Ministry
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
