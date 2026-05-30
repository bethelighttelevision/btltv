"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Globe, Send, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("subject", subject || "General Inquiry");
      formData.append("message", message);
      formData.append("_template", "table");
      const res = await fetch("https://formsubmit.co/ajax/contact@btl-tv.com", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Send failed");
      toast.success("Message sent successfully! We'll get back to you soon.");
      setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");
    } catch {
      toast.error("Failed to send message. Please try again later or email us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-btl-dark via-btl-dark to-btl-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.06),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-btl-red/50" />
              <Mail className="h-7 w-7 text-btl-red" />
              <div className="h-px w-12 bg-btl-red/50" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
            <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">We would love to hear from you. Reach out to us through any of the channels below.</p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 via-btl-red/5 to-transparent p-4 md:p-5 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-btl-red/20 flex items-center justify-center"><Mail className="h-5 w-5 text-btl-red" /></div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Send us an Email</h2>
                  <p className="text-xs text-muted-foreground">Fill out the form and we'll reply within 24 hours</p>
                </div>
              </div>
            </div>
            <CardContent className="p-5">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="bg-btl-dark/50 border-border/50 h-11" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="bg-btl-dark/50 border-border/50 h-11" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone (optional)</label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" className="bg-btl-dark/50 border-border/50 h-11" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What is this about?" className="bg-btl-dark/50 border-border/50 h-11" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message *</label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you?" className="bg-btl-dark/50 border-border/50 min-h-[120px] resize-none" required />
                </div>
                <Button type="submit" disabled={sending} className="w-full bg-btl-red hover:bg-btl-red/90 text-white font-semibold h-12 min-h-[44px] text-base">
                  {sending ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Sending...</> : <><Send className="h-5 w-5 mr-2" /> Send Message</>}
                </Button>
              </form>
              <div className="mt-4 pt-4 border-t border-border/20 text-center">
                <p className="text-xs text-muted-foreground mb-3">Or email us directly:</p>
                <a href="mailto:contact@btl-tv.com" className="inline-flex items-center gap-2 text-btl-red hover:text-btl-red/80 text-sm font-medium transition-colors">
                  contact@btl-tv.com →
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="bg-btl-card border-btl-card-border overflow-hidden h-full">
              <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-5 border-b border-btl-card-border">
                <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-btl-red" /><h2 className="text-lg font-bold text-foreground">Netherlands</h2></div>
              </div>
              <CardContent className="p-5 space-y-4">
                {[
                  { icon: MapPin, label: "Address", value: "Westeinde 21, 8064 AJ Zwartsluis" },
                  { icon: Phone, label: "Phone / WhatsApp", value: "https://wa.me/31685097840", link: true },
                  { icon: Mail, label: "Email", value: "contact@btl-tv.com", mail: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0"><item.icon className="h-5 w-5 text-btl-red" /></div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{item.label}</h3>
                      {(item as any).link ? <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-sm text-[#25D366] hover:underline mt-0.5 block">{item.value}</a>
                        : (item as any).mail ? <a href={`mailto:${item.value}`} className="text-sm text-btl-red hover:underline mt-0.5 block">{item.value}</a>
                        : <p className="text-sm text-muted-foreground mt-0.5">{item.value}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <Card className="bg-btl-card border-btl-card-border overflow-hidden h-full">
              <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-5 border-b border-btl-card-border">
                <div className="flex items-center gap-3"><Globe className="h-5 w-5 text-btl-red" /><h2 className="text-lg font-bold text-foreground">Pakistan</h2></div>
              </div>
              <CardContent className="p-5 space-y-4">
                {[
                  { icon: MapPin, label: "Address", value: "Phase II Karachi" },
                  { icon: Phone, label: "Phone", value: "555-242-8848", tel: true },
                  { icon: Mail, label: "Email", value: "info@btl-tv.com", mail: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0"><item.icon className="h-5 w-5 text-btl-red" /></div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{item.label}</h3>
                      {(item as any).tel ? <a href={`tel:${item.value}`} className="text-sm text-btl-red hover:underline mt-0.5 block">{item.value}</a>
                        : (item as any).mail ? <a href={`mailto:${item.value}`} className="text-sm text-btl-red hover:underline mt-0.5 block">{item.value}</a>
                        : <p className="text-sm text-muted-foreground mt-0.5">{item.value}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>


      </div>
    </div>
  );
}
