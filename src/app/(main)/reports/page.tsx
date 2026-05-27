"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Shield, Newspaper, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ANNUAL_REPORTS, OTHER_REPORTS } from "@/lib/site-data";

export default function ReportsPage() {
  const renderReportCard = (report: { title: string; year: string; file: string }, subtitle: string) => (
    <motion.div
      key={report.title}
      whileHover={{ scale: 1.01 }}
    >
      <a href={report.file} target="_blank" rel="noopener noreferrer" className="block">
        <Card className="bg-btl-card border-btl-card-border hover:border-btl-red/30 transition-all cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6 text-btl-red" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{report.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            </div>
            <Badge className="bg-btl-dark text-muted-foreground text-xs shrink-0">{report.year}</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-btl-red hover:text-btl-red-dark shrink-0"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span className="text-xs">View</span>
            </Button>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );

  return (
    <div className="min-h-screen px-4 md:px-6 py-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Reports</h1>
        <p className="text-muted-foreground">Annual reports and financial statements of Stichting BTL TV.</p>
      </div>

      {/* ANBI Status */}
      <Card className="bg-btl-card border-btl-card-border mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-btl-red" />
            <h2 className="text-lg font-bold text-foreground">ANBI Registered Foundation</h2>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img src="/images/stichting/anbi-logo.webp" alt="ANBI" width={200} height={147} loading="lazy" className="h-20 w-auto object-contain" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Stichting Be The Light Television is registered as an ANBI (Algemeen Nut Beogende Instelling).
              As an ANBI-certified organization, we are committed to transparency and publish our annual
              reports and financial statements for public review.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Annual Reports Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-btl-red" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Annual Reports</h2>
            <p className="text-xs text-muted-foreground">Yearly financial statements of Stichting BTL TV</p>
          </div>
        </div>
        <div className="space-y-3">
          {ANNUAL_REPORTS.map((report) => renderReportCard(report, "Annual Financial Statement — Stichting BTL TV"))}
        </div>
      </div>

      {/* Other Reports & Documents Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
            <Newspaper className="h-5 w-5 text-btl-red" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Other Reports & Documents</h2>
            <p className="text-xs text-muted-foreground">Balance sheets, declarations, newsletters, and more</p>
          </div>
        </div>
        <div className="space-y-3">
          {OTHER_REPORTS.map((report) => renderReportCard(report, "Official Document — Stichting BTL TV"))}
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-muted-foreground text-sm">
          For more information about our reports, please contact us at{" "}
          <a href="mailto:info@btl-tv.com" className="text-btl-red hover:underline">
            info@btl-tv.com
          </a>
        </p>
      </div>
    </div>
  );
}
