"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Tv, Globe, HandHeart, BookOpen, Landmark, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  // The donation link with amount parameter - geef.nl
  const donationLink = `https://www.geef.nl/nl/doneer?charity=9949&backLink=https%3A%2F%2Fwww.geef.nl%2Fnl%2Fdoel%2Fbe-the-light-television%2Fover-ons${finalAmount ? `&bedrag=${finalAmount}` : ""}`;

  return (
    <div className="min-h-screen px-4 md:px-6 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Support BTL TV</h1>
      <p className="text-muted-foreground mb-8">Help us continue spreading the light of Christ through media.</p>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-btl-red via-btl-red/70 to-btl-dark mb-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          <CardContent className="relative p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-white fill-white" />
              <Badge className="bg-btl-red text-black font-bold text-xs">DONATE</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Support Our Ministry</h2>
            <p className="text-white/70 text-sm sm:text-base max-w-lg mb-6">
              Your generous donations help BTL TV continue producing quality Christian content and reaching
              Urdu-speaking communities worldwide with the message of hope.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Tv, text: "Produce New Programs" },
                { icon: Globe, text: "Reach More Viewers" },
                { icon: HandHeart, text: "Support the Oppressed" },
                { icon: BookOpen, text: "Spread the Gospel" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-btl-red shrink-0" />
                  <span className="text-sm text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Amount Selector */}
      <Card className="bg-btl-card border-btl-card-border mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-btl-red">€</span>
            Select Donation Amount
          </h3>

          {/* Preset Amounts */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`py-3 rounded-lg font-bold text-lg transition-all min-h-[48px] ${selectedAmount === amount && !customAmount
                    ? "bg-btl-red text-white ring-2 ring-btl-red/50"
                    : "bg-btl-dark/50 text-muted-foreground hover:bg-btl-dark hover:text-foreground border border-border/30"
                  }`}
              >
                €{amount}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
            <Input
              type="number"
              min="1"
              placeholder="Custom amount"
              className="pl-10 bg-btl-dark/50 border-border/50 text-foreground h-12 text-lg"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
            />
          </div>

          {/* Donor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Your Name (optional)"
              className="bg-btl-dark/50 border-border/50"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Your Email (optional)"
              className="bg-btl-dark/50 border-border/50"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
            />
          </div>

          {/* Donate Button - Opens external link with selected amount */}
          <Button
            className="w-full bg-btl-red hover:bg-btl-red-dark text-white font-bold text-lg h-14 min-h-[48px]"
            onClick={() => window.open(donationLink, "_blank")}
            disabled={!finalAmount || finalAmount <= 0}
          >
            <Heart className="h-5 w-5 mr-2 fill-current" />
            Donate {finalAmount ? `€${finalAmount}` : ""}
          </Button>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card className="bg-btl-card border-btl-card-border mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Landmark className="h-5 w-5 text-btl-red" />
            Bank Transfer Details
          </h3>
          <div className="space-y-3">
            {[
              { label: "Account Name", value: "Stichting BTL TV" },
              { label: "IBAN", value: "NL06 RABO 0317 1209 80" },
              { label: "BIC/Swift", value: "RABONL2U" },
              { label: "Reference", value: "Donation BTL TV" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm text-foreground font-mono font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-btl-card border-btl-card-border mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-btl-red" />
            Tax Deductibility
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Stichting Be The Light Television is an ANBI-registered foundation (Algemeen Nut Beogende Instelling).
            Donations to ANBI-certified organizations are tax-deductible in the Netherlands. Your donation helps
            us continue our mission of spreading the Gospel to Urdu-speaking communities worldwide.
          </p>
          <div className="flex justify-center mt-4">
            <img src="/images/stichting/anbi-logo.webp" alt="ANBI Certified" width={200} height={147} loading="lazy" className="h-16 w-auto object-contain" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
