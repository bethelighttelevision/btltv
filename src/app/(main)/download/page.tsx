"use client";

import { motion } from "framer-motion";
import { Smartphone, Check, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  "Watch Live TV 24/7",
  "Browse all 40+ shows",
  "Urdu Audio Bible — 66 books",
  "Search & bookmarks",
  "Free with no ads",
  "Dark theme optimized",
];

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-btl-dark">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="h-20 w-20 mx-auto rounded-2xl bg-btl-red/20 flex items-center justify-center mb-6">
            <Smartphone className="h-10 w-10 text-btl-red" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Download BTL TV App</h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Get the official Be The Light Television Android app. Watch live TV, browse shows, listen to the Urdu Audio Bible, and stay connected with the ministry.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-btl-card/80 border-btl-card-border h-full">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-lg font-bold text-foreground mb-4">App Features</h2>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="h-5 w-5 text-btl-red shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-btl-card/80 border-btl-card-border h-full">
              <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full">
                <div className="h-16 w-16 rounded-xl bg-btl-red/20 flex items-center justify-center mb-4">
                  <Smartphone className="h-8 w-8 text-btl-red" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">Android APK</h2>
                <p className="text-sm text-muted-foreground mb-4">Version 1.0.0 · 92 MB · Android 8+</p>
                <a href="/api/download" className="w-full">
                  <Button size="lg" className="w-full bg-btl-red hover:bg-btl-red-dark text-white font-semibold min-h-[48px]">
                    <Smartphone className="h-5 w-5 mr-2" />
                    Download Now
                  </Button>
                </a>
                <p className="text-[11px] text-muted-foreground mt-3">
                  Your download will start automatically
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 p-4 rounded-lg bg-btl-card/40 border border-btl-card-border text-center"
        >
          <p className="text-xs text-muted-foreground">
            <Cross className="h-3 w-3 text-btl-red inline mr-1" />
            After downloading, open the APK file and tap "Install" (you may need to enable "Install from unknown sources" in your device settings).
          </p>
        </motion.div>
      </div>
    </div>
  );
}
