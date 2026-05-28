"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Tv, Globe, HandHeart, BookOpen, Landmark, Shield, AlertTriangle, MapPin, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DonationContent() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const presetAmounts = [10, 25, 50, 100, 250, 500];
  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const donationLink = `https://www.geef.nl/nl/doneer?charity=9949&backLink=https%3A%2F%2Fwww.geef.nl%2Fnl%2Fdoel%2Fbe-the-light-television%2Fover-ons${finalAmount ? `&bedrag=${finalAmount}` : ""}`;

  return (
    <div className="min-h-screen px-4 md:px-6 py-6 max-w-4xl mx-auto">
      {/* Official Alert */}
      <Card className="border-2 border-red-500/50 bg-red-950/20 mb-8">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-red-400">IMPORTANT — Official Donation Channels</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We only accept donations through our official partner{" "}
                <strong className="text-foreground">Geef.nl</strong> (online payment platform).
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">BTL TV</strong> (Stichting Be The Light Television) is a{" "}
                <strong className="text-foreground">Netherlands-based</strong> Urdu Christian television ministry.
                We are <strong className="text-red-400">NOT</strong> affiliated with
                "Be the Light TV & CO." (bethelighttv.co), "Helping Hands Ministries" (hhmin.org),
                or any other organization using the "Be the Light" name.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you see donation requests on any other website using our name, please contact us immediately at{" "}
                <a href="mailto:info@btl-tv.com" className="text-btl-red hover:underline font-medium">info@btl-tv.com</a>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Who We Are */}
      <Card className="bg-btl-card border-btl-card-border mb-8">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-btl-red" />
            Who We Are
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-btl-red shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-foreground">Stichting Be The Light Television (BTL TV)</span>
                <p className="text-sm text-muted-foreground">Westeinde 21, 8064 AJ Zwartsluis, Netherlands</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-btl-red shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-foreground">Registration</span>
                <p className="text-sm text-muted-foreground">KvK: 68202377 | ANBI: 857342423</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 text-btl-red shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-foreground">Ministry</span>
                <p className="text-sm text-muted-foreground">Netherlands-based Urdu Christian television broadcasting worldwide</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donation Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-btl-red via-btl-red/70 to-btl-dark mb-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          <CardContent className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-6 w-6 text-white fill-white" />
                  <Badge className="bg-btl-red text-black font-bold text-xs">DONATE</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Support Our Ministry</h2>
                <p className="text-white/70 text-sm sm:text-base max-w-lg mb-6">
                  Your generous donations help BTL TV continue producing quality Christian content and reaching Urdu-speaking communities worldwide with the message of hope.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Tv, text: "Produce New Programs" },
                    { icon: Globe, text: "Reach More Viewers" },
                    { icon: HandHeart, text: "Support the Oppressed" },
                    { icon: BookOpen, text: "Spread the Gospel" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-white/70 shrink-0" />
                      <span className="text-sm text-white/80">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-center w-full md:w-48 lg:w-56 relative">
                <PiggyBankAnimation />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Donation Form */}
      <Card className="bg-btl-card border-btl-card-border mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
            <Heart className="h-5 w-5 text-btl-red" />
            Donate via Geef.nl
          </h3>
          <p className="text-xs text-muted-foreground mb-4">This is the only official online donation method for BTL TV.</p>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-btl-red">€</span> Select Donation Amount
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {presetAmounts.map((amount) => (
              <button key={amount} onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                className={`py-3 rounded-lg font-bold text-lg transition-all min-h-[48px] ${selectedAmount === amount && !customAmount ? "bg-btl-red text-white ring-2 ring-btl-red/50" : "bg-btl-dark/50 text-muted-foreground hover:bg-btl-dark hover:text-foreground border border-border/30"}`}>
                €{amount}
              </button>
            ))}
          </div>
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
            <Input type="number" min="1" placeholder="Custom amount" className="pl-10 bg-btl-dark/50 border-border/50 text-foreground h-12 text-lg"
              value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Input placeholder="Your Name (optional)" className="bg-btl-dark/50 border-border/50" value={donorName} onChange={(e) => setDonorName(e.target.value)} />
            <Input type="email" placeholder="Your Email (optional)" className="bg-btl-dark/50 border-border/50" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} />
          </div>
          <Button className="w-full bg-btl-red hover:bg-btl-red-dark text-white font-bold text-lg h-14 min-h-[48px]"
            onClick={() => window.open(donationLink, "_blank")} disabled={!finalAmount || finalAmount <= 0}>
            <Heart className="h-5 w-5 mr-2 fill-current" /> Donate {finalAmount ? `€${finalAmount}` : ""}
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-btl-card border-btl-card-border mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Landmark className="h-5 w-5 text-btl-red" /> Bank Transfer Details</h3>
          <p className="text-xs text-muted-foreground mb-4">Bank transfers are for reference only. Online donations should be made via Geef.nl above.</p>
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
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-btl-red" /> Tax Deductibility</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Stichting Be The Light Television is an ANBI-registered foundation (Algemeen Nut Beogende Instelling).
            Donations to ANBI-certified organizations are tax-deductible in the Netherlands.
          </p>
          <div className="flex justify-center mt-4">
            <img src="/images/stichting/anbi-logo.webp" alt="ANBI Certified" width={200} height={147} loading="lazy" className="h-16 w-auto object-contain" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PiggyBankAnimation() {
  return (
    <div className="relative w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52">
      <style>{`
        @keyframes coinDrop {
          0% { transform: translateY(-60px) translateX(0) scale(0.5); opacity: 0; }
          10% { transform: translateY(-60px) translateX(0) scale(1); opacity: 1; }
          60% { transform: translateY(20px) translateX(15px) scale(1); opacity: 1; }
          75% { transform: translateY(38px) translateX(10px) scale(0.6); opacity: 0.6; }
          100% { transform: translateY(42px) translateX(8px) scale(0); opacity: 0; }
        }
        @keyframes piggyBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          15% { transform: translateY(-3px) rotate(-2deg); }
          30% { transform: translateY(0) rotate(0deg); }
          45% { transform: translateY(-2px) rotate(1deg); }
          60% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes smileGrow {
          0%, 60% { d: path("M30,70 Q38,78 46,70"); }
          70%, 100% { d: path("M28,68 Q38,82 48,68"); }
        }
        @keyframes tailWag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes eyeBlink {
          0%, 95%, 100% { transform: scaleY(1); }
          97% { transform: scaleY(0.1); }
        }
        @keyframes slotGlow {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.6; }
        }
        .coin-anim {
          animation: coinDrop 3s ease-in-out infinite;
        }
        .piggy-anim {
          animation: piggyBounce 3s ease-in-out infinite;
        }
        .tail-anim {
          animation: tailWag 1.5s ease-in-out infinite;
          transform-origin: 52px 38px;
        }
        .eye-left { animation: eyeBlink 4s ease-in-out infinite; }
        .eye-right { animation: eyeBlink 4s ease-in-out infinite 0.3s; }
        .smile-path {
          animation: smileGrow 3s ease-in-out infinite;
        }
        .slot-glow {
          animation: slotGlow 3s ease-in-out infinite;
        }
      `}</style>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,85,0,0.2)]">
        {/* Coin */}
        <g className="coin-anim">
          <circle cx="50" cy="0" r="5" fill="#FFD700" />
          <circle cx="50" cy="0" r="4" fill="#FFC107" />
          <text x="50" y="2" textAnchor="middle" fontSize="5" fill="#B8860B" fontWeight="bold">€</text>
        </g>
        {/* Piggy Body */}
        <g className="piggy-anim">
          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="28" ry="4" fill="rgba(0,0,0,0.15)" />
          {/* Tail */}
          <path d="M72,42 Q80,35 82,28 Q83,24 80,25 Q77,26 79,30" fill="none" stroke="#F48FB1" strokeWidth="3" strokeLinecap="round" className="tail-anim" />
          {/* Back legs */}
          <rect x="60" y="72" width="8" height="12" rx="4" fill="#F06292" />
          <rect x="32" y="72" width="8" height="12" rx="4" fill="#F06292" />
          {/* Body */}
          <ellipse cx="48" cy="50" rx="32" ry="28" fill="#F48FB1" />
          <ellipse cx="48" cy="48" rx="30" ry="26" fill="#F8BBD0" />
          {/* Highlight */}
          <ellipse cx="38" cy="36" rx="14" ry="10" fill="rgba(255,255,255,0.2)" transform="rotate(-15,38,36)" />
          {/* Ears */}
          <ellipse cx="68" cy="28" rx="6" ry="8" fill="#F48FB1" transform="rotate(20,68,28)" />
          <ellipse cx="68" cy="28" rx="4" ry="6" fill="#F8BBD0" transform="rotate(20,68,28)" />
          <ellipse cx="34" cy="26" rx="6" ry="8" fill="#F48FB1" transform="rotate(-15,34,26)" />
          <ellipse cx="34" cy="26" rx="4" ry="6" fill="#F8BBD0" transform="rotate(-15,34,26)" />
          {/* Coin Slot */}
          <rect x="42" y="22" width="10" height="3" rx="1" fill="#D81B60" />
          <rect x="43" y="22.5" width="8" height="2" rx="1" fill="#FBBF24" className="slot-glow" />
          {/* Eyes */}
          <circle cx="38" cy="42" r="4" fill="#333" className="eye-left" />
          <circle cx="60" cy="42" r="4" fill="#333" className="eye-right" />
          <circle cx="39" cy="40" r="1.5" fill="white" />
          <circle cx="61" cy="40" r="1.5" fill="white" />
          {/* Snout */}
          <ellipse cx="48" cy="60" rx="12" ry="8" fill="#F06292" />
          <ellipse cx="48" cy="60" rx="10" ry="6" fill="#F48FB1" />
          {/* Nostrils */}
          <circle cx="43" cy="59" r="2" fill="#D81B60" />
          <circle cx="53" cy="59" r="2" fill="#D81B60" />
          {/* Smile */}
          <path d="M30,70 Q38,78 46,70" fill="none" stroke="#D81B60" strokeWidth="2" strokeLinecap="round" className="smile-path" />
          {/* Cheek blush */}
          <ellipse cx="28" cy="56" rx="4" ry="3" fill="rgba(255,100,100,0.2)" />
          <ellipse cx="68" cy="56" rx="4" ry="3" fill="rgba(255,100,100,0.2)" />
        </g>
      </svg>
    </div>
  );
}
