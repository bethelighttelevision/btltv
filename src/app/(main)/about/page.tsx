"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Cross,
  BookOpen,
  Users,
  Globe,
  Sparkles,
  Shield,
  HandHeart,
  BookMarked,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PARTNERS } from "@/lib/site-data";

function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="relative w-full h-[40vh] sm:h-[50vh] overflow-hidden">
        <img
          src="/images/about/about-banner.webp"
          alt="About BTL TV"
          width={735}
          height={555}
          className="w-full h-full object-cover"
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">About BTL TV</h1>
          <p className="text-white/70 text-base sm:text-lg mt-2">Be The Light Television</p>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed">
              BTL TV — Be The Light Television is a Christian faith-based media platform that broadcasts
              content in Urdu for Pakistani-speaking communities around the world. Founded by Douwe Wijmenga,
              BTL TV is dedicated to spreading the Gospel of Jesus Christ through television programming that
              educates, inspires, and uplifts.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Based in the Netherlands, BTL TV produces a wide range of programs including daily devotionals,
              talk shows addressing social issues, dramatic series, health programs, and documentaries — all
              designed to bring the light of Christ to Urdu-speaking audiences.
            </p>
          </div>

          <Card className="bg-btl-card border-btl-card-border">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-btl-red" />
                <h3 className="text-xl font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg italic">
                &ldquo;To be the light of Christ in the world through media, reaching Urdu-speaking communities
                with the message of hope, salvation, and God&apos;s unfailing love — empowering believers to stand
                firm in their faith and be a voice for the voiceless.&rdquo;
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Cross, title: "Faith", desc: "Rooted in the Word of God and the Gospel of Jesus Christ." },
                { icon: Shield, title: "Justice", desc: "Standing for the rights of minorities and the oppressed." },
                { icon: HandHeart, title: "Compassion", desc: "Reaching out with love and care to those in need." },
                { icon: BookMarked, title: "Truth", desc: "Presenting biblical truth through quality media content." },
              ].map((val) => (
                <Card key={val.title} className="bg-btl-card border-btl-card-border">
                  <CardContent className="p-5 flex gap-4 items-start">
                    <div className="h-10 w-10 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
                      <val.icon className="h-5 w-5 text-btl-red" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{val.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{val.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Partners - 3D Animated */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-btl-red/40" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Partners</h2>
              <div className="h-px w-12 bg-btl-red/40" />
            </div>
            <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
              {PARTNERS.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{
                    scale: 1.08,
                    rotateY: 8,
                    rotateX: -4,
                    z: 40,
                  }}
                  style={{ perspective: 800 }}
                  className="group cursor-pointer"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-btl-red/0 group-hover:bg-btl-red/15 rounded-2xl blur-xl transition-all duration-500 scale-110" />
                    <Card className="relative bg-btl-card/80 border-btl-card-border hover:border-btl-red/40 transition-all duration-500 flex items-center justify-center p-6 md:p-8 h-32 w-48 md:h-40 md:w-60 backdrop-blur-sm group-hover:shadow-[0_0_30px_rgba(229,9,20,0.15)]">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        width={400}
                        height={228}
                        loading="lazy"
                        className="max-h-20 md:max-h-24 max-w-full object-contain brightness-90 contrast-110 group-hover:brightness-110 group-hover:contrast-125 transition-all duration-500 drop-shadow-[0_0_8px_rgba(229,9,20,0.1)] group-hover:drop-shadow-[0_0_16px_rgba(229,9,20,0.25)]"
                      />
                    </Card>
                  </div>
                  <p className="text-center text-[11px] md:text-xs text-muted-foreground mt-2 font-medium group-hover:text-btl-red transition-colors duration-300">
                    {partner.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AboutPage;
