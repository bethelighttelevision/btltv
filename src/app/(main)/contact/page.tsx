"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Youtube,
  Facebook,
  Instagram,
  Send,
  Loader2,
  MessageCircle,
  Disc3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function ContactPage() {
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
      const res = await fetch("https://formsubmit.co/ajax/admin@btl-tv.com", {
        method: "POST",
        body: formData,
      });
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
      {/* Professional Header */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-btl-dark via-btl-dark to-btl-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.06),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
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
        {/* Email Contact Form - Primary CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 via-btl-red/5 to-transparent p-4 md:p-5 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-btl-red/20 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-btl-red" />
                </div>
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
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-btl-dark/50 border-border/50 h-11"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-btl-dark/50 border-border/50 h-11"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone (optional)</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 890"
                      className="bg-btl-dark/50 border-border/50 h-11"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is this about?"
                      className="bg-btl-dark/50 border-border/50 h-11"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message *</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    className="bg-btl-dark/50 border-border/50 min-h-[120px] resize-none"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-btl-red hover:bg-btl-red/90 text-white font-semibold h-12 min-h-[44px] text-base"
                >
                  {sending ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="h-5 w-5 mr-2" /> Send Message</>
                  )}
                </Button>
              </form>

              {/* Quick WhatsApp link */}
              <div className="mt-4 pt-4 border-t border-border/20 text-center">
                <p className="text-xs text-muted-foreground mb-3">Prefer instant messaging?</p>
                <a
                  href="https://wa.me/31685097840"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#20bd5a] text-sm font-medium transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp →
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Netherlands */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="bg-btl-card border-btl-card-border overflow-hidden h-full">
              <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-5 border-b border-btl-card-border">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-btl-red" />
                  <h2 className="text-lg font-bold text-foreground">Netherlands</h2>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-btl-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Address</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Westeinde 21, 8064 AJ Zwartsluis</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-btl-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Phone / WhatsApp</h3>
                    <a href="https://wa.me/31685097840" target="_blank" rel="noopener noreferrer" className="text-sm text-[#25D366] hover:underline mt-0.5 block">+31 6 85097840</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-btl-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Email</h3>
                    <a href="mailto:admin@btl-tv.com" className="text-sm text-btl-red hover:underline mt-0.5 block">admin@btl-tv.com</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pakistan */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <Card className="bg-btl-card border-btl-card-border overflow-hidden h-full">
              <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-5 border-b border-btl-card-border">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-btl-red" />
                  <h2 className="text-lg font-bold text-foreground">Pakistan</h2>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-btl-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Address</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Phase II Karachi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-btl-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Phone</h3>
                    <a href="tel:555-242-8848" className="text-sm text-btl-red hover:underline mt-0.5 block">555-242-8848</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-btl-red/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-btl-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Email</h3>
                    <a href="mailto:info@btl-tv.com" className="text-sm text-btl-red hover:underline mt-0.5 block">info@btl-tv.com</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Social Media - Full Width */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-5 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-btl-red" />
                <h2 className="text-lg font-bold text-foreground">Follow Us</h2>
              </div>
            </div>
            <CardContent className="p-5">
              <div className="flex gap-3 flex-wrap">
                <Button variant="outline" size="icon" className="h-12 w-12 border-border/30 text-muted-foreground hover:text-btl-red hover:border-btl-red/30" onClick={() => window.open("https://www.youtube.com/@btltv", "_blank")}>
                  <Youtube className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 border-border/30 text-muted-foreground hover:text-[#ff5500] hover:border-[#ff5500]/30" onClick={() => window.open("https://soundcloud.com/user-549013936", "_blank")}>
                  <Disc3 className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 border-border/30 text-muted-foreground hover:text-btl-red hover:border-btl-red/30" onClick={() => window.open("https://www.facebook.com/btltv", "_blank")}>
                  <Facebook className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 border-border/30 text-muted-foreground hover:text-btl-red hover:border-btl-red/30" onClick={() => window.open("https://www.instagram.com/btltv", "_blank")}>
                  <Instagram className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ContactPage;
