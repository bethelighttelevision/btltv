"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Tv,
  BookOpen,
  Users,
  Phone,
  Mail,
  MapPin,
  Globe,
  Youtube,
  Facebook,
  Instagram,
  Cross,
  Clock,
  ArrowLeft,
  ExternalLink,
  ChevronUp,
  MessageCircle,
  Shield,
  HandHeart,
  Sparkles,
  BookMarked,
  Mic,
  Drama,
  Stethoscope,
  GraduationCap,
  Newspaper,
  Building2,
  Landmark,
  FileText,
  Scale,
  Camera,
  Monitor,
  Headphones,
  UserCircle,
  Crown,
  Briefcase,
  Gavel,
  Baby,
  Disc3,
  RotateCcw,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import episodesData from "@/lib/episodes-data.json";

// ─── Types ───────────────────────────────────────────────────────────
interface Episode {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  position: number;
}

interface Program {
  id: string;
  title: string;
  poster: string;
  category: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description?: string;
  group: string;
  objectPosition?: string;
}

// PWA beforeinstallprompt event type
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// ─── Navigation ──────────────────────────────────────────────────────
const NAV_LINKS = [
  { key: "home", label: "Home", icon: Tv },
  { key: "shows", label: "Shows", icon: Play },
  { key: "live", label: "Live TV", icon: Flame },
  { key: "bible-school", label: "Bible School", icon: BookMarked },
  { key: "about", label: "About", icon: BookOpen },
  { key: "stichting", label: "Stichting", icon: Building2 },
  { key: "team", label: "Team", icon: Users },
  { key: "kids", label: "Kids", icon: Baby },
  { key: "donation", label: "Donation", icon: Heart },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "contact", label: "Contact", icon: Phone },
];

// ─── Programs Data ───────────────────────────────────────────────────
const PROGRAMS: Program[] = [
  {
    id: "PLC0Rch0KTiEL1XcXiXO76FeMysmOQda-v",
    title: "Debate",
    poster: "/images/programs/debate.webp",
    category: "TALK SHOW",
    description: "Christian apologetics and theological debates with scholars and experts.",
  },
  {
    id: "PLC0Rch0KTiEL-7g_5Zt4nmcj1tKUMVlDJ",
    title: "Connection",
    poster: "/images/programs/connection.webp",
    category: "TALK SHOW",
    description: "A youth program connecting faith with everyday life and biblical truths.",
  },
  {
    id: "PLC0Rch0KTiEJty_pIPyX862w551dRhSPC",
    title: "295C",
    poster: "/images/programs/295c.webp",
    category: "SOCIAL ISSUES",
    description: "Discussing Pakistan's blasphemy laws and their impact on minority communities.",
  },
  {
    id: "PLC0Rch0KTiEL3jSy9_haZ0IwwVnEOM502",
    title: "Meri Aawaz Suno",
    poster: "/images/programs/meri-awaz-suno.webp",
    category: "TALK SHOW",
    description: "Giving voice to the voiceless — highlighting injustice and advocating for the oppressed.",
  },
  {
    id: "PLC0Rch0KTiEJJU9cHbZ_aZHkQuQKtG353",
    title: "Bol K Lab Azad Hain Tere",
    poster: "/images/programs/bol-k-lub-azad-hai-tere.webp",
    category: "TALK SHOW",
    description: "Speak freely — exploring women's roles in the Bible and society.",
  },
  {
    id: "PLC0Rch0KTiEK78XGqgSzTgYovHc6M6l3M",
    title: "Ora et Labora",
    poster: "/images/programs/ora-et-labora.webp",
    category: "DOCUMENTARY",
    description: "Pray and Work — documentary series featuring Christian businesses and their faith journeys.",
  },
  {
    id: "PLC0Rch0KTiEJHTsKT-ccjvRsQ7wq0zhNA",
    title: "Ochtend met Jezus | Predikant Douwe Wijmenga",
    poster: "/images/programs/morning-with-jesus-predikant-douwe-wijmenga.webp",
    category: "DEVOTIONAL",
    description: "Morning devotionals in Dutch with Predikant Douwe Wijmenga, studying the Gospel of Mark.",
  },
  {
    id: "PLC0Rch0KTiEK2HGhHh6ju0UAbR4GPpv_h",
    title: "Masihi Zindagi",
    poster: "https://i.ytimg.com/vi/pX1ngNLVn30/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Christian Life — practical teachings on living a faith-filled life.",
  },
  {
    id: "PLC0Rch0KTiEJ5atmrt0aNyTJTbBRk8Dtd",
    title: "Yesu Sang Sawera | Pastor Munawar Virk",
    poster: "/images/programs/yesu-sang-sawera-pastor-munawar-virk.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Pastor Munawar Virk.",
  },
  {
    id: "PLC0Rch0KTiEK59AdKYUxvjD4FYGGAk-3W",
    title: "Yesu Sang Sawera | Pastor Imran Gill",
    poster: "/images/programs/yesu-sang-sawera-pastor-imran-gill.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Pastor Imran Gill.",
  },
  {
    id: "PLC0Rch0KTiEJjSOc-b5azFbgnCgy27PFx",
    title: "Yesu Sang Sawera | Predikant Imko Postma",
    poster: "/images/programs/ochtend-met-jezus-predikant-imko-postma.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — devotional with Predikant Imko Postma.",
  },
  {
    id: "PLC0Rch0KTiEJIkPavJjvPDX1eslj5q2Mt",
    title: "Yesu Sang Sawera | Pastor Sarfaraz Rehmat",
    poster: "/images/programs/yesu-sang-sawera-pastor-sarfaraz-rehmat.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Pastor Sarfaraz Rehmat.",
  },
  {
    id: "PLC0Rch0KTiEIR35NdZTLISgKRMlc3BVw3",
    title: "Morning With Jesus | Pastor Robert Slack",
    poster: "/images/programs/morning-with-jesus-pastor-robert-slack.webp",
    category: "DEVOTIONAL",
    description: "Morning devotional with Pastor Robert Slack.",
  },
  {
    id: "PLC0Rch0KTiEKa9nRM45q3IjtjnEcxx8Oq",
    title: "Ochtend met Jezus | Predikant Terpstra",
    poster: "/images/programs/ochtend-met-jezus-pastor-terpstra.webp",
    category: "DEVOTIONAL",
    description: "Morning devotionals in Dutch with Predikant Terpstra.",
  },
  {
    id: "PLC0Rch0KTiEI_mnwHqbtFVWkoBepRVJYz",
    title: "Yesu Sang Sawera | Pastor Parvaiz Iqbal",
    poster: "/images/programs/yesu-sang-sawera-pastor-parvaiz-iqbal.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — devotional through the liturgical calendar with Pastor Parvaiz Iqbal.",
  },
  {
    id: "PLC0Rch0KTiEIM81Nxga6kBzrWTI4zKW6B",
    title: "Yesu Sang Sawera | Bishop Emmanuel Aftab",
    poster: "/images/programs/yesu-sang-sawera-bishop-emmanuel-aftab.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Bishop Emmanuel Aftab.",
  },
  {
    id: "PLC0Rch0KTiEJmdYO0rgoAyxHvufDMRqey",
    title: "Puray Dil Se",
    poster: "/images/programs/puray-dil-se.webp",
    category: "DEVOTIONAL",
    description: "With All Your Heart — heartfelt worship and devotional program.",
  },
  {
    id: "PLC0Rch0KTiEJf5LpXqJUB7BOPTIxxYE4Y",
    title: "Tehqeeq-E-Bible",
    poster: "https://i.ytimg.com/vi/-vE4aOXdFU8/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Bible Research — in-depth study and investigation of biblical texts.",
  },
  {
    id: "PLC0Rch0KTiEJTLA68BSOZiawjHha_STu6",
    title: "Farman-e-Masih",
    poster: "/images/programs/farman-e-masih.webp",
    category: "DEVOTIONAL",
    description: "Commandment of Christ — teachings from the words of Jesus.",
  },
  {
    id: "PLC0Rch0KTiEKieg3BaUFw9Awo951JERSq",
    title: "Azmat-E-Masih",
    poster: "https://i.ytimg.com/vi/C4Q5lYDdKZg/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Glory of Christ — exploring the majesty and divinity of Jesus Christ.",
  },
  {
    id: "PLC0Rch0KTiELEXZy_VRdLOII3zDpXYh-m",
    title: "Choti Si Baat",
    poster: "/images/programs/choti-si-baat.webp",
    category: "TALK SHOW",
    description: "A Small Matter — conversations about everyday faith and life.",
  },
  {
    id: "PLC0Rch0KTiEJD0sPwhLDZKTexs0RhHtTk",
    title: "Aao Hamad Karin",
    poster: "https://i.ytimg.com/vi/9JdEOSZFiLs/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Come Let's Praise — worship and praise program.",
  },
  {
    id: "PLC0Rch0KTiEKswX3Uhy-Rbc_v8oZGWoaN",
    title: "Food for Your Heart",
    poster: "https://i.ytimg.com/vi/Ul0WTSmDN2M/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Spiritual nourishment for your soul — health and faith combined.",
  },
  {
    id: "PLC0Rch0KTiEJzzhjty0HYs02WBzM4Y7G1",
    title: "Yesu Sang Sawera | Pastor Nadeem K Dean",
    poster: "/images/programs/yesu-sang-sawera-pastor-nadeem-k-dean.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Pastor Nadeem K Dean.",
  },
  {
    id: "PLC0Rch0KTiEJzd_BEgTrtW25He9bc5ykP",
    title: "Daagh",
    poster: "/images/programs/daag.webp",
    category: "DRAMA",
    description: "Stain — drama addressing forced conversions and social injustice.",
  },
  {
    id: "PLC0Rch0KTiEJviSmXh9ffFJ57rLQcS84A",
    title: "Meri Kahani",
    poster: "https://i.ytimg.com/vi/_URLEq-amhM/hqdefault.jpg",
    category: "DRAMA",
    description: "My Story — true testimonies of Muslim converts to Christianity.",
  },
  {
    id: "PLC0Rch0KTiEKhqfRdSq7N9syvs31FNUQU",
    title: "Bandhan",
    poster: "/images/programs/bandhan.webp",
    category: "DRAMA",
    description: "Bond — dramatic series exploring relationships and faith.",
  },
  {
    id: "PLC0Rch0KTiEIub8WrDOvvwOfy2VMA8wV2",
    title: "BTL Drama Specials",
    poster: "https://i.ytimg.com/vi/KF9HGJn_mno/hqdefault.jpg",
    category: "DRAMA",
    description: "Special drama productions and short stories from BTL TV.",
  },
  {
    id: "PLC0Rch0KTiEIez3wRZiuJ3uIAVeqO8UAk",
    title: "Aap Ki Sehat",
    poster: "/images/programs/aap-ki-sehat.webp",
    category: "HEALTH",
    description: "Your Health — health awareness program covering mental and physical wellbeing.",
  },
  {
    id: "PLC0Rch0KTiEJappsAzGuHckX-6Tnv3e0C",
    title: "Return Ticket",
    poster: "/images/programs/return-ticket.webp",
    category: "DRAMA",
    description: "Drama exploring the journey of life — are we physical or spiritual beings?",
  },
  {
    id: "PLC0Rch0KTiEIXhIrONRD0BUJOfT02hwOZ",
    title: "Aao Chalein",
    poster: "/images/programs/aao-chalein.webp",
    category: "DOCUMENTARY",
    description: "Let's Go — documentary covering social issues, human rights, and community events.",
  },
  {
    id: "PLC0Rch0KTiEJJUdDkkF1ErTjG92L6u4bq",
    title: "Such Ki Khooj",
    poster: "https://i.ytimg.com/vi/1x6dYFEObWM/hqdefault.jpg",
    category: "DOCUMENTARY",
    description: "Search for Truth — investigative series exploring truth and faith.",
  },
  {
    id: "PLC0Rch0KTiELmNtPpNsAFdD5R0DuHsc57",
    title: "Safar-e-Shanakhat",
    poster: "/images/programs/safar-e-shanakht.webp",
    category: "DOCUMENTARY",
    description: "Journey of Identity — documentary exploring Christian identity and heritage.",
  },
  {
    id: "PLC0Rch0KTiEKFnSQS_7_yzCXlBVE14c9K",
    title: "Career Guide",
    poster: "/images/programs/career-guide.webp",
    category: "EDUCATION",
    description: "Career guidance and professional development for youth.",
  },
  {
    id: "PLC0Rch0KTiELF-r1NYnvutDhWwFA_PuWb",
    title: "Hamare Sitare",
    poster: "/images/programs/hamarey-sitarey.webp",
    category: "TALK SHOW",
    description: "Our Stars — interviews with prominent Christian leaders and personalities.",
  },
  {
    id: "PLC0Rch0KTiEL62fRR7QFYnybfId__kUGp",
    title: "Pakistan Hamara Bhi Hai",
    poster: "/images/programs/pakistan-hamara-bhi-hai.webp",
    category: "SOCIAL ISSUES",
    description: "Pakistan Is Ours Too — advocating for minority rights and equal citizenship.",
  },
  {
    id: "PLC0Rch0KTiEJ5r54n700_prgbhdZExCJG",
    title: "BTL TV News & Updates",
    poster: "/images/programs/news.webp",
    category: "NEWS",
    description: "Official updates and news from Be The Light Television.",
  },
  {
    id: "PLC0Rch0KTiEJ6w6w6w6w6w",
    title: "Jawab Tu Hai",
    poster: "/images/programs/jawab-tu-hai.webp",
    category: "TALK SHOW",
    description: "A talk show exploring answers to life's big questions through the lens of faith.",
  },
  {
    id: "MORNING_JESUS_POPOOLA",
    title: "Morning With Jesus | Pastor Oluwabukunmi Popoola",
    poster: "https://i.ytimg.com/vi/E73nvG7jm2o/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Morning devotional with Pastor Oluwabukunmi Popoola.",
  },
  {
    id: "PLC0Rch0KTiEJU6V0fg9XydpOjM8Yp0eAY",
    title: "Yesu Sang Sawera | Pastor William Paighani",
    poster: "https://i.ytimg.com/vi/yl1M9TTo0TM/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Pastor William Paighani.",
  },
  {
    id: "PLC0Rch0KTiEIXuKgpvm7mq4YlLQ__HssQ",
    title: "Urdu Bible",
    poster: "https://i.ytimg.com/vi/6bjIhLSE504/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Complete Urdu Bible — audio readings of Genesis, Exodus, Proverbs, Gospels, and more.",
  },
];

// ─── Kids Programs ───────────────────────────────────────────────────
const KIDS_PROGRAMS: Program[] = [
  {
    id: "PLC0Rch0KTiEINBNsxKVWV5gXlu8EmlWV0",
    title: "Prophecies About Jesus Christ",
    poster: "https://i.ytimg.com/vi/M_efw5g34gs/hqdefault.jpg",
    category: "KIDS",
    description: "Biblical prophecies about Jesus Christ explained for children.",
  },
  {
    id: "PLC0Rch0KTiEJ4Ys17Q2GyDerDxuUkhe2z",
    title: "Kids Stories",
    poster: "https://i.ytimg.com/vi/3v5dYvZweHg/hqdefault.jpg",
    category: "KIDS",
    description: "Bible stories told in a fun and engaging way for kids.",
  },
  {
    id: "PLC0Rch0KTiELwlkkreDtcIdxhPmASJbpJ",
    title: "Kids Programe | Bible Study",
    poster: "https://i.ytimg.com/vi/j0CU07nX-vg/hqdefault.jpg",
    category: "KIDS",
    description: "Bible study programs designed specially for children.",
  },
];

// ─── Category info ───────────────────────────────────────────────────
const CATEGORIES: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  "TALK SHOW": { label: "Talk Shows", icon: Mic, color: "from-btl-red/20 to-black/90" },
  DEVOTIONAL: { label: "Devotional", icon: BookOpen, color: "from-btl-red/20 to-black/90" },
  DRAMA: { label: "Drama", icon: Drama, color: "from-btl-red/25 to-black/90" },
  DOCUMENTARY: { label: "Documentary", icon: Globe, color: "from-btl-red/20 to-black/90" },
  "SOCIAL ISSUES": { label: "Social Issues", icon: Shield, color: "from-btl-red/20 to-black/90" },
  HEALTH: { label: "Health", icon: Stethoscope, color: "from-btl-red/20 to-black/90" },
  EDUCATION: { label: "Education", icon: GraduationCap, color: "from-btl-red/20 to-black/90" },
  NEWS: { label: "News", icon: Newspaper, color: "from-btl-red/20 to-black/90" },
  KIDS: { label: "Kids", icon: Baby, color: "from-btl-red/20 to-black/90" },
};

// ─── Team Members (Hierarchical) ────────────────────────────────────
const TEAM_GROUPS = [
  {
    title: "Leadership",
    icon: Crown,
    members: [
      { name: "Gasper Daniel", role: "CEO & Founder", image: "/images/team/Gasper%20Daniel%20CEO%20&%20Founder.png" },
      { name: "Sumble Noreen", role: "Vice President", image: "/images/team/Sumble%20Noreen%20Vice%20President.png" },
      { name: "Sahir Alam", role: "Head of Audio & Video", image: "/images/team/sahir-alam.webp" },
    ],
  },
  {
    title: "Office",
    icon: Briefcase,
    members: [
      { name: "Karal Yohana", role: "Head of Department", image: "/images/team/Karal%20Yohana%20Head%20of%20Department.png" },
      { name: "Nayyar Noel", role: "Co-Ordinator", image: "/images/team/nayyar-noel.webp" },
      { name: "Khisal Daniel", role: "Director of Photography", image: "/images/team/Khisal%20Daniel%20Director%20of%20Photography.png" },
      { name: "Minahil Daniel", role: "Director of Photography", image: "/images/team/Minahil%20Daniel%20Director%20of%20Photography.png" },
    ],
  },
  {
    title: "Hosts",
    icon: Mic,
    members: [
      { name: "Watson Gill", role: "Host", image: "/images/team/watson-gill.webp" },
    ],
  },
  {
    title: "Pastors & Predikants",
    icon: BookOpen,
    members: [
      { name: "Emmanuel Aftab", role: "Bishop", image: "/images/team/emmanuel-aftab.webp" },
      { name: "Douwe Wijmenga", role: "Predikant", image: "/images/team/douwe-wijmenga.webp" },
      { name: "Imko Postma", role: "Predikant", image: "/images/team/imko-postma.webp" },
      { name: "Terpstra", role: "Predikant", image: "/images/team/terpstra.webp" },
      { name: "Imran Gill", role: "Pastor", image: "/images/team/imran-gill.webp" },
      { name: "Munawar Virk", role: "Pastor", image: "/images/team/munawar-virk.webp" },
      { name: "Nadeem K Dean", role: "Pastor", image: "/images/team/nadeem-k-dean.webp" },
      { name: "Parvaiz Iqbal", role: "Pastor", image: "/images/team/parvaiz-iqbal.webp" },
      { name: "Robert Slack", role: "Pastor", image: "/images/team/robert-slack.webp" },
      { name: "Sarfraz Rehmat", role: "Pastor", image: "/images/team/sarfraz-rehmat.webp" },
      { name: "William Paighani", role: "Pastor", image: "/images/team/william-paighani.webp" },
    ],
  },
  {
    title: "Legal & Others",
    icon: Gavel,
    members: [
      { name: "Lazar Allah Rakha", role: "Advocate", image: "/images/team/lazar-allah-rakha.webp" },
      { name: "Sooba Bhatti", role: "Advocate", image: "/images/team/sooba-bhatti.webp" },
      { name: "Malook Israel", role: "News Reporter", image: "/images/team/malook-israel.webp" },
    ],
  },
];

// Flat team list for backward compatibility
const TEAM_MEMBERS: TeamMember[] = TEAM_GROUPS.flatMap((g) =>
  g.members.map((m) => ({ ...m, group: g.title }))
);

// ─── Partners ────────────────────────────────────────────────────────
const PARTNERS = [
  { name: "De Fontein", logo: "/images/partners/de-fontein.webp" },
  { name: "GKU PKN Urk", logo: "/images/partners/gku-pkn-urk.webp" },
  { name: "Verre Naasten", logo: "/images/partners/verre-naasten.webp" },
];

// ─── Hero featured shows ────────────────────────────────────────────
const HERO_SHOWS = [
  { programId: "btl-logo", title: "BTL TV", subtitle: "Be The Light Television", image: "/images/programs/banner-image.webp" },
  { programId: "PLC0Rch0KTiEJmdYO0rgoAyxHvufDMRqey", title: "Puray Dil Se", subtitle: "With All Your Heart", image: "/images/programs/banner-image.webp" },
  { programId: "PLC0Rch0KTiEJty_pIPyX862w551dRhSPC", title: "295C", subtitle: "Social Justice Program", image: "/images/programs/295c.webp" },
  { programId: "PLC0Rch0KTiEJJU9cHbZ_aZHkQuQKtG353", title: "Bol K Lab Azad Hain Tere", subtitle: "Speak Freely", image: "/images/programs/bol-k-lub-azad-hai-tere.webp" },
  { programId: "PLC0Rch0KTiEJappsAzGuHckX-6Tnv3e0C", title: "Return Ticket", subtitle: "Drama Series", image: "/images/programs/return-ticket.webp" },
  { programId: "PLC0Rch0KTiEL3jSy9_haZ0IwwVnEOM502", title: "Meri Aawaz Suno", subtitle: "Hear My Voice", image: "/images/programs/meri-awaz-suno.webp" },
  { programId: "PLC0Rch0KTiEK78XGqgSzTgYovHc6M6l3M", title: "Ora et Labora", subtitle: "Pray & Work", image: "/images/programs/ora-et-labora.webp" },
];

// ─── Reports ─────────────────────────────────────────────────────────
const ANNUAL_REPORTS = [
  { title: "Annual Report 2024", year: "2024", file: "/reports/Reports BTL Tv/Financieel_verslag_2024.pdf" },
  { title: "Annual Report 2023", year: "2023", file: "/reports/Reports BTL Tv/Financieel_verslag_2023.pdf" },
  { title: "Annual Report 2022", year: "2022", file: "/reports/Reports BTL Tv/Financieel_verslag_2022.pdf" },
  { title: "Annual Report 2021", year: "2021", file: "/reports/Reports BTL Tv/Financieel_verslag_2021.pdf" },
  { title: "Annual Report 2020", year: "2020", file: "/reports/Reports BTL Tv/Financieel_verslag_2020.pdf" },
  { title: "Annual Report 2019", year: "2019", file: "/reports/Reports BTL Tv/Financieel_verslag_2019.pdf" },
  { title: "Annual Report 2018", year: "2018", file: "/reports/Reports BTL Tv/Financieel_verslag_2018.pdf" },
  { title: "Annual Report 2017", year: "2017", file: "/reports/Reports BTL Tv/Financieel_verslag_2017.pdf" },
];

const OTHER_REPORTS = [
  { title: "Balance Sheet 2021", year: "2021", file: "/reports/Reports BTL Tv/Balans-BTL-2021.pdf" },
  { title: "Declaration 2021", year: "2021", file: "/reports/Reports BTL Tv/Verklaring-BTL-2021.pdf" },
  { title: "BTL TV Social Media Report", year: "2024", file: "/reports/Reports BTL Tv/BTL-tv-Social-Media-Report-Presentation.pdf" },
  { title: "BTL NL Report 2024", year: "2024", file: "/reports/Reports BTL Tv/BTLNL-rapport-2024-met-correctie-.pdf" },
  { title: "Board Meeting Report", year: "2021", file: "/reports/Reports BTL Tv/BM-meeting-2.pdf" },
  { title: "Missionair Newsletter Nov 2018", year: "2018", file: "/reports/Reports BTL Tv/3_VNA-16384-Missionair-November-2018.pdf" },
  { title: "VNA Newsletter", year: "2018", file: "/reports/Reports BTL Tv/VNA-Nieuwsbrief.pdf" },
  { title: "Nieuwsbode Weekly", year: "2020", file: "/reports/Reports BTL Tv/Nieuwsbode_wk52_NB12.pdf" },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function getEpisodes(playlistId: string): Episode[] {
  return (episodesData.episodes as Record<string, Episode[]>)[playlistId] || [];
}

function getEpisodeCount(playlistId: string): number {
  return getEpisodes(playlistId).length;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// ─── HLS Video Player Component ─────────────────────────────────────
function HLSPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const hlsRef = useRef<import("hls.js").default | null>(null);

  useEffect(() => {
    let hls: import("hls.js").default | null = null;
    const initPlayer = async () => {
      if (!videoRef.current) return;
      const Hls = (await import("hls.js")).default;
      const src = "https://livecdn.live247stream.com/btl/tv/playlist.m3u8";
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          startLevel: -1,
        });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          videoRef.current?.play().catch(() => { });
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // Try to recover network errors
                if (retryCount < 3) {
                  setRetryCount((prev) => prev + 1);
                  hls?.startLoad();
                } else {
                  setError(true);
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls?.recoverMediaError();
                break;
              default:
                setError(true);
                break;
            }
          }
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = src;
        videoRef.current.addEventListener("loadeddata", () => setLoading(false));
        videoRef.current.addEventListener("error", () => setError(true));
        videoRef.current.play().catch(() => { });
      } else {
        setError(true);
      }
    };
    initPlayer();
    return () => {
      if (hls) hls.destroy();
    };
  }, [retryCount]);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setRetryCount(0);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white gap-4">
        <Tv className="h-12 w-12 text-btl-red" />
        <p className="text-sm text-white/70">Live stream temporarily unavailable</p>
        <div className="flex gap-3">
          <Button
            className="bg-btl-red hover:bg-btl-red-dark text-white min-h-[44px]"
            onClick={() => window.open("https://www.youtube.com/@btltv", "_blank")}
          >
            <Youtube className="h-4 w-4 mr-2" />
            Watch on YouTube
          </Button>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 min-h-[44px]"
            onClick={handleRetry}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
          <div className="h-10 w-10 border-2 border-btl-red border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-white/50">Connecting to live stream...</p>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        autoPlay
        playsInline
        muted
        controls
      />
    </div>
  );
}

// ─── Program Card (Unified Landscape Style) ──────────────────────────
function ProgramCard({
  program,
  onClick,
  size = "normal",
}: {
  program: Program;
  onClick: () => void;
  size?: "normal" | "small";
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`relative overflow-hidden rounded-md bg-btl-card ${size === "small"
            ? "w-36 sm:w-44"
            : "w-44 sm:w-52"
          }`}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={program.poster}
            alt={program.title}
            width={320}
            height={180}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-1.5 left-1.5 bg-btl-red/90 text-white text-[9px] font-bold px-1.5 py-0">
            {program.category}
          </Badge>
          <div className="absolute bottom-1.5 right-1.5 bg-black/60 rounded-full px-1.5 py-0 text-[9px] text-white flex items-center gap-0.5">
            <Play className="h-2.5 w-2.5 fill-white" />
            {getEpisodeCount(program.id)}
          </div>
        </div>
        <div className="pt-1.5 px-2 pb-2">
          <h3 className={`font-medium text-foreground truncate leading-tight ${size === "small" ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"
            }`}>
            {program.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Urdu Audio Bible Player ─────────────────────────────────────────
const BIBLE_BOOKS = [
  { id: "gen", name: "Genesis", nameUr: "پیدائش", chapters: 50, testament: "OT" },
  { id: "exo", name: "Exodus", nameUr: "خروج", chapters: 40, testament: "OT" },
  { id: "lev", name: "Leviticus", nameUr: "احبار", chapters: 27, testament: "OT" },
  { id: "num", name: "Numbers", nameUr: "گنتی", chapters: 36, testament: "OT" },
  { id: "deu", name: "Deuteronomy", nameUr: "استثنا", chapters: 34, testament: "OT" },
  { id: "jos", name: "Joshua", nameUr: "یوشع", chapters: 24, testament: "OT" },
  { id: "jdg", name: "Judges", nameUr: "قضات", chapters: 21, testament: "OT" },
  { id: "rut", name: "Ruth", nameUr: "روت", chapters: 4, testament: "OT" },
  { id: "1sa", name: "1 Samuel", nameUr: "1 سموئیل", chapters: 31, testament: "OT" },
  { id: "2sa", name: "2 Samuel", nameUr: "2 سموئیل", chapters: 24, testament: "OT" },
  { id: "1ki", name: "1 Kings", nameUr: "1 سلاطین", chapters: 22, testament: "OT" },
  { id: "2ki", name: "2 Kings", nameUr: "2 سلاطین", chapters: 25, testament: "OT" },
  { id: "1ch", name: "1 Chronicles", nameUr: "1 تواریخ", chapters: 29, testament: "OT" },
  { id: "2ch", name: "2 Chronicles", nameUr: "2 تواریخ", chapters: 36, testament: "OT" },
  { id: "ezr", name: "Ezra", nameUr: "عزرا", chapters: 10, testament: "OT" },
  { id: "neh", name: "Nehemiah", nameUr: "نحمیاہ", chapters: 13, testament: "OT" },
  { id: "est", name: "Esther", nameUr: "استر", chapters: 10, testament: "OT" },
  { id: "job", name: "Job", nameUr: "ایوب", chapters: 42, testament: "OT" },
  { id: "psa", name: "Psalms", nameUr: "زبور", chapters: 150, testament: "OT" },
  { id: "pro", name: "Proverbs", nameUr: "امثال", chapters: 31, testament: "OT" },
  { id: "ecc", name: "Ecclesiastes", nameUr: "واعظ", chapters: 12, testament: "OT" },
  { id: "sos", name: "Song of Solomon", nameUr: "غزل غزلات", chapters: 8, testament: "OT" },
  { id: "isa", name: "Isaiah", nameUr: "یسعیاہ", chapters: 66, testament: "OT" },
  { id: "jer", name: "Jeremiah", nameUr: "یرمیاہ", chapters: 52, testament: "OT" },
  { id: "lam", name: "Lamentations", nameUr: "مراثی", chapters: 5, testament: "OT" },
  { id: "eze", name: "Ezekiel", nameUr: "حزقی ایل", chapters: 48, testament: "OT" },
  { id: "dan", name: "Daniel", nameUr: "دانی ایل", chapters: 12, testament: "OT" },
  { id: "hos", name: "Hosea", nameUr: "ہوشع", chapters: 14, testament: "OT" },
  { id: "jol", name: "Joel", nameUr: "یوایل", chapters: 3, testament: "OT" },
  { id: "amo", name: "Amos", nameUr: "عاموس", chapters: 9, testament: "OT" },
  { id: "oba", name: "Obadiah", nameUr: "عوبدیہ", chapters: 1, testament: "OT" },
  { id: "jon", name: "Jonah", nameUr: "یونس", chapters: 4, testament: "OT" },
  { id: "mic", name: "Micah", nameUr: "میکاہ", chapters: 7, testament: "OT" },
  { id: "nah", name: "Nahum", nameUr: "ناحوم", chapters: 3, testament: "OT" },
  { id: "hab", name: "Habakkuk", nameUr: "حبقوق", chapters: 3, testament: "OT" },
  { id: "zep", name: "Zephaniah", nameUr: "صفنیاہ", chapters: 3, testament: "OT" },
  { id: "hag", name: "Haggai", nameUr: "حجی", chapters: 2, testament: "OT" },
  { id: "zec", name: "Zechariah", nameUr: "زکریاہ", chapters: 14, testament: "OT" },
  { id: "mal", name: "Malachi", nameUr: "ملاکی", chapters: 4, testament: "OT" },
  { id: "mat", name: "Matthew", nameUr: "متی", chapters: 28, testament: "NT" },
  { id: "mrk", name: "Mark", nameUr: "مرقس", chapters: 16, testament: "NT" },
  { id: "luk", name: "Luke", nameUr: "لوقا", chapters: 24, testament: "NT" },
  { id: "jhn", name: "John", nameUr: "یوحنا", chapters: 21, testament: "NT" },
  { id: "act", name: "Acts", nameUr: "اعمال", chapters: 28, testament: "NT" },
  { id: "rom", name: "Romans", nameUr: "رومیوں", chapters: 16, testament: "NT" },
  { id: "1co", name: "1 Corinthians", nameUr: "1 کرنتھیوں", chapters: 16, testament: "NT" },
  { id: "2co", name: "2 Corinthians", nameUr: "2 کرنتھیوں", chapters: 13, testament: "NT" },
  { id: "gal", name: "Galatians", nameUr: "گلاتیوں", chapters: 6, testament: "NT" },
  { id: "eph", name: "Ephesians", nameUr: "افسیوں", chapters: 6, testament: "NT" },
  { id: "php", name: "Philippians", nameUr: "فلیپیوں", chapters: 4, testament: "NT" },
  { id: "col", name: "Colossians", nameUr: "کولسیوں", chapters: 4, testament: "NT" },
  { id: "1th", name: "1 Thessalonians", nameUr: "1 تھسلونیکیوں", chapters: 5, testament: "NT" },
  { id: "2th", name: "2 Thessalonians", nameUr: "2 تھسلونیکیوں", chapters: 3, testament: "NT" },
  { id: "1ti", name: "1 Timothy", nameUr: "1 تیمتاؤس", chapters: 6, testament: "NT" },
  { id: "2ti", name: "2 Timothy", nameUr: "2 تیمتاؤس", chapters: 4, testament: "NT" },
  { id: "tit", name: "Titus", nameUr: "ططس", chapters: 3, testament: "NT" },
  { id: "phm", name: "Philemon", nameUr: "فلمون", chapters: 1, testament: "NT" },
  { id: "heb", name: "Hebrews", nameUr: "عبرانیوں", chapters: 13, testament: "NT" },
  { id: "jas", name: "James", nameUr: "یعقوب", chapters: 5, testament: "NT" },
  { id: "1pe", name: "1 Peter", nameUr: "1 پطرس", chapters: 5, testament: "NT" },
  { id: "2pe", name: "2 Peter", nameUr: "2 پطرس", chapters: 3, testament: "NT" },
  { id: "1jn", name: "1 John", nameUr: "1 یوحنا", chapters: 5, testament: "NT" },
  { id: "2jn", name: "2 John", nameUr: "2 یوحنا", chapters: 1, testament: "NT" },
  { id: "3jn", name: "3 John", nameUr: "3 یوحنا", chapters: 1, testament: "NT" },
  { id: "jud", name: "Jude", nameUr: "یہوداہ", chapters: 1, testament: "NT" },
  { id: "rev", name: "Revelation", nameUr: "مکاشفہ", chapters: 22, testament: "NT" },
];

// Map book IDs to GBC Pakistan Urdu Audio Bible filenames
// Source: https://www.gbcpakistan.org/urdu-bible/ — Christian Urdu Bible, Grace Bible Church Pakistan
const GBC_AUDIO_MAP: Record<string, string> = {
  gen: "Genesis", exo: "Exodus", lev: "Leviticus", num: "Numbers", deu: "Deuteronomy",
  jos: "Joshua", jdg: "Judges", rut: "Ruth",
  "1sa": "I_Samuel", "2sa": "II_Samuel", "1ki": "I_Kings", "2ki": "II_Kings",
  "1ch": "I_Chronicles", "2ch": "II_Chronicles", ezr: "Ezra", neh: "Nehemiah", est: "Esther",
  job: "Job", psa: "Psalms", pro: "Proverbs", ecc: "Ecclesiastes", sos: "Song_of_Solomon",
  isa: "Isaiah", jer: "Jeremiah", lam: "Lamentations", eze: "Ezekiel", dan: "Daniel",
  hos: "Hosea", jol: "Joel", amo: "Amos", oba: "Obadiah", jon: "Jonah",
  mic: "Micah", nah: "Nahum", hab: "Habakkuk", zep: "Zephaniah", hag: "Haggai",
  zec: "Zechariah", mal: "Malachi",
  mat: "Mathew", mrk: "Mark", luk: "Luke", jhn: "John", act: "Acts",
  rom: "Romans", "1co": "I_Corinthians", "2co": "II_Corinthians", gal: "Galatians", eph: "Ephesians",
  php: "Philippians", col: "Colossians", "1th": "I_Thessalonians", "2th": "II_Thessalonians",
  "1ti": "I_Timothy", "2ti": "II_Timothy", tit: "Titus", phm: "Philemon", heb: "Hebrews",
  jas: "James", "1pe": "I_Peter", "2pe": "II_Peter", "1jn": "I_John", "2jn": "II_John",
  "3jn": "III_John", jud: "Jude", rev: "Revelation",
};

function UrduBiblePlayer() {
  const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[39]); // Matthew by default
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [testamentFilter, setTestamentFilter] = useState<"OT" | "NT">("NT");
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const retryCountRef = useRef(0);

  // Helper to get audio URL — GBC Pakistan Christian Urdu Bible
  const getAudioUrl = (bookId: string, chapter: number) =>
    `https://www.gbcpakistan.org/mp3/urdu_bible/${GBC_AUDIO_MAP[bookId]}${chapter}.mp3`;

  // Core play function - with robust retry logic
  const loadAndPlay = useCallback((bookId: string, chapter: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioLoading(true);
    setAudioError(false);
    retryCountRef.current = 0;

    const playAttempt = () => {
      const url = getAudioUrl(bookId, chapter);
      // Append a timestamp cache buster on retries to bypass broken browser caches
      audio.src = retryCountRef.current > 0 ? `${url}?t=${Date.now()}` : url;
      audio.load();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAudioLoading(false);
            setAudioError(false);
          })
          .catch((err) => {
            console.log("Audio play error:", err);
            if (retryCountRef.current < 4) { // Increased to 4 retries
              retryCountRef.current++;
              // Exponential backoff for retries
              setTimeout(playAttempt, retryCountRef.current * 1000);
            } else {
              setAudioError(true);
              setAudioLoading(false);
            }
          });
      }
    };

    playAttempt();
  }, []);

  const playAudio = useCallback(() => {
    loadAndPlay(selectedBook.id, selectedChapter);
  }, [selectedBook.id, selectedChapter, loadAndPlay]);

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleBookSelect = useCallback((book: typeof BIBLE_BOOKS[0]) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setAudioError(false);
    retryCountRef.current = 0;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setProgress(dur > 0 ? (cur / dur) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
  };

  const skipChapter = useCallback((dir: -1 | 1) => {
    const newCh = selectedChapter + dir;
    if (newCh >= 1 && newCh <= selectedBook.chapters) {
      setSelectedChapter(newCh);
      setProgress(0);
      setAudioError(false);
      retryCountRef.current = 0;
      loadAndPlay(selectedBook.id, newCh);
    }
  }, [selectedChapter, selectedBook, loadAndPlay]);

  // Find next book in the Bible
  const getNextBook = useCallback((currentBook: typeof BIBLE_BOOKS[0]) => {
    const idx = BIBLE_BOOKS.findIndex(b => b.id === currentBook.id);
    if (idx >= 0 && idx < BIBLE_BOOKS.length - 1) {
      return BIBLE_BOOKS[idx + 1];
    }
    return null;
  }, []);

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const filteredBooks = BIBLE_BOOKS.filter(
    (b) => b.testament === testamentFilter && (searchQuery === "" || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.nameUr.includes(searchQuery))
  );

  const otCount = 39; // Old Testament has 39 books
  const ntCount = 27; // New Testament has 27 books

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/5 flex flex-col lg:flex-row relative">

      {/* ── LEFT PANEL: Player Controls ──────────────────────────── */}
      <div className="relative lg:w-[340px] flex-shrink-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a0505] to-[#0f0f0f] p-7 flex flex-col justify-between z-10 border-b lg:border-b-0 lg:border-r border-white/5">

        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.12),transparent_70%)] pointer-events-none" />

        {/* Book Info */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                {(isPlaying || audioLoading) && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-btl-red opacity-75" />}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying || audioLoading ? 'bg-btl-red' : 'bg-gray-600'}`} />
              </span>
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.15em]">
                {selectedBook.testament === "OT" ? "Old Testament" : "New Testament"}
              </span>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-1">
            {selectedBook.name}
          </h2>
          <h3 className="text-lg text-gray-500 font-urdu mb-4 leading-tight" dir="rtl">
            {selectedBook.nameUr}
          </h3>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-btl-red/10 border border-btl-red/20">
            <span className="text-btl-red font-bold text-sm">Chapter {selectedChapter}</span>
            <span className="text-gray-600 text-xs">/ {selectedBook.chapters}</span>
          </div>
        </div>

        {/* Waveform visualizer (decorative bars) */}
        <div className="relative z-10 my-5 flex items-end justify-center gap-[3px] h-8">
          {[...Array(22)].map((_, i) => {
            const baseH = 4 + Math.abs(Math.sin(i * 0.7)) * 20;
            return (
              <div
                key={i}
                className={`w-[3px] rounded-full transition-colors duration-300 ${isPlaying ? 'bg-btl-red/70' : 'bg-white/10'}`}
                style={{ height: `${baseH}px` }}
              />
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 mb-5 space-y-2">
          <div
            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer relative group/bar"
            onClick={seekTo}
          >
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-btl-red to-[#ff4444] rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(229,9,20,0.6)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-white rounded-full shadow-lg scale-0 group-hover/bar:scale-100 transition-transform origin-center translate-x-1/2 border-2 border-btl-red" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono font-medium text-gray-600 tracking-wider">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center justify-center gap-5">
          <button
            disabled={selectedChapter <= 1}
            onClick={() => skipChapter(-1)}
            className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isPlaying
                ? "bg-white text-black hover:scale-105"
                : audioError
                  ? "bg-red-900/50 text-red-400 border border-red-500/50 hover:bg-red-900/70"
                  : "bg-btl-red text-white hover:bg-[#ff1a25] hover:scale-110 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_35px_rgba(229,9,20,0.7)]"
            }`}
            onClick={audioError ? playAudio : isPlaying ? pauseAudio : playAudio}
            disabled={audioLoading && !audioError}
          >
            {audioLoading && !audioError ? (
              <div className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : audioError ? (
              <RotateCcw className="h-5 w-5" />
            ) : isPlaying ? (
              <Pause className="h-7 w-7 fill-current" />
            ) : (
              <Play className="h-7 w-7 fill-current ml-0.5" />
            )}
          </button>

          <button
            disabled={selectedChapter >= selectedBook.chapters}
            onClick={() => skipChapter(1)}
            className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Status messages */}
        <div className="relative z-10 h-8 mt-4 text-center">
          <AnimatePresence>
            {audioError && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xs text-red-400 font-medium">Audio unavailable — tap retry.</p>
                <p className="text-[10px] text-gray-600 font-urdu mt-0.5" dir="rtl">دوبارہ کوشش کریں</p>
              </motion.div>
            )}
            {audioLoading && !audioError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-500"
              >
                Loading chapter {selectedChapter}…
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <audio
          ref={audioRef}
          preload="none"
          onEnded={() => {
            setProgress(0);
            setDuration(0);
            if (selectedChapter < selectedBook.chapters) {
              const nextCh = selectedChapter + 1;
              setSelectedChapter(nextCh);
              loadAndPlay(selectedBook.id, nextCh);
            } else {
              const nextBook = getNextBook(selectedBook);
              if (nextBook) {
                setSelectedBook(nextBook);
                setSelectedChapter(1);
                setTestamentFilter(nextBook.testament);
                loadAndPlay(nextBook.id, 1);
              } else {
                setIsPlaying(false);
              }
            }
          }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => {
            if (retryCountRef.current < 3) {
              retryCountRef.current++;
              const audio = audioRef.current;
              if (audio) {
                setTimeout(() => {
                  audio.load();
                  audio.play().catch(() => setAudioError(true));
                }, retryCountRef.current * 800);
              }
            } else {
              setAudioError(true);
            }
          }}
        />
      </div>

      {/* ── RIGHT PANEL: Book + Chapter Selectors ─────────────────── */}
      <div className="flex-1 bg-[#0d0d0d] flex flex-col">

        {/* Testament Toggle + Search */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-white/5 gap-1">
            <button
              onClick={() => setTestamentFilter("NT")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                testamentFilter === "NT"
                  ? "bg-btl-red text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              New (27)
            </button>
            <button
              onClick={() => setTestamentFilter("OT")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                testamentFilter === "OT"
                  ? "bg-btl-red text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Old (39)
            </button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
            <Input
              placeholder="Search book..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1a1a] border-white/5 h-10 text-xs pl-9 rounded-xl text-gray-300 placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Books Grid */}
        <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "220px" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Select Book</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
            {filteredBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => handleBookSelect(book)}
                className={`p-2.5 rounded-xl text-left transition-all duration-200 border ${
                  book.id === selectedBook.id
                    ? "bg-btl-red/15 border-btl-red/50 shadow-[0_0_12px_rgba(229,9,20,0.2)]"
                    : "bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/15"
                }`}
              >
                <p className={`text-[11px] font-semibold truncate leading-tight ${book.id === selectedBook.id ? "text-btl-red" : "text-gray-300"}`}>
                  {book.name}
                </p>
                <p className="text-[9px] text-gray-600 truncate mt-0.5" dir="rtl">{book.nameUr}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Grid */}
        <div className="border-t border-white/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">
            Chapter — <span className="text-btl-red">{selectedBook.chapters} total</span>
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
              <button
                key={ch}
                onClick={() => {
                  setSelectedChapter(ch);
                  setProgress(0);
                  setDuration(0);
                  setAudioError(false);
                  retryCountRef.current = 0;
                  loadAndPlay(selectedBook.id, ch);
                }}
                className={`min-w-[34px] h-8 px-2 rounded-lg text-[11px] font-bold transition-all duration-150 ${
                  ch === selectedChapter
                    ? "bg-btl-red text-white shadow-[0_0_10px_rgba(229,9,20,0.4)] scale-110"
                    : "bg-white/5 text-gray-500 hover:bg-btl-red/20 hover:text-btl-red hover:scale-105"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── SoundCloud Playlists ─────────────────────────────────────────────
const SOUNDCLOUD_PLAYLISTS = [
  { slug: "khuda-kon-hai", title: "Khuda Kon Hai", titleUr: "خدا کون ہے", icon: "✝️" },
  { slug: "merry-christmas", title: "Merry Christmas", titleUr: "میری کرسمس", icon: "🎄" },
  { slug: "abraham-sarah", title: "Abraham & Sarah", titleUr: "ابراہیم اور سارہ", icon: "📖" },
  { slug: "the-story-of-jacob-from-bible", title: "Story of Jacob", titleUr: "یعقوب کی کہانی", icon: "📖" },
  { slug: "the-story-of-noah-from-bible", title: "Story of Noah", titleUr: "نوح کی کہانی", icon: "⛵" },
  { slug: "the-story-of-noah-for-kids", title: "Noah for Kids", titleUr: "بچوں کے لیے نوح", icon: "🧒" },
  { slug: "beauty-with-brain-queen-esther", title: "Queen Esther", titleUr: "ملکہ استر", icon: "👑" },
  { slug: "adam-eve", title: "Adam & Eve", titleUr: "آدم اور حوا", icon: "🍎" },
  { slug: "urdu-zaboor-by-sumble-noreen-arrangement-dr-khizan-bashir", title: "Urdu Zaboor", titleUr: "اردو زبور", icon: "🎵" },
  { slug: "the-story-of-mary-sister-of", title: "Story of Mary", titleUr: "مریم کی کہانی", icon: "🙏" },
];

function SoundCloudSection() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(SOUNDCLOUD_PLAYLISTS[0]);

  const embedUrl = `https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/user-549013936/sets/${selectedPlaylist.slug}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;

  return (
    <section className="relative py-12 overflow-hidden bg-[#050505] border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff5500]/10 via-[#050505] to-[#050505] opacity-50"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/20 mb-3 shadow-[0_0_10px_rgba(255,85,0,0.1)]">
              <Headphones className="h-3.5 w-3.5 text-[#ff5500]" />
              <span className="text-[#ff5500] text-[10px] font-bold tracking-widest uppercase">TWR Urdu & Punjabi</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-md">
              Spiritual Audio <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5500] to-btl-red">Library</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-sm font-urdu text-right" dir="rtl">
            آڈیو کہانیوں اور زبور کے ذریعے خدا کی آواز سنیں۔
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Playlists Sidebar - Compact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 flex flex-col gap-3 bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl shadow-xl"
          >
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar max-h-[380px] overflow-y-auto pr-1">
              {SOUNDCLOUD_PLAYLISTS.map((pl) => (
                <button
                  key={pl.slug}
                  onClick={() => setSelectedPlaylist(pl)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 whitespace-nowrap md:whitespace-normal shrink-0 border text-left ${selectedPlaylist.slug === pl.slug
                      ? "bg-gradient-to-r from-[#ff5500]/10 to-transparent border-[#ff5500]/30 shadow-[0_0_15px_rgba(255,85,0,0.1)]"
                      : "bg-black/20 border-transparent hover:bg-white/5"
                    }`}
                >
                  <div className={`text-xl h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedPlaylist.slug === pl.slug ? "bg-[#ff5500]/20" : "bg-white/5"}`}>
                    {pl.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${selectedPlaylist.slug === pl.slug ? "text-white" : "text-gray-300"}`}>
                      {pl.title}
                    </p>
                    <p className="text-xs font-urdu text-gray-500 mt-0.5 truncate" dir="rtl">{pl.titleUr}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Player Main Area - Compact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <div className="relative rounded-2xl bg-[#0a0a0a] border border-white/10 p-3 shadow-2xl overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ff5500]/5 blur-[80px] pointer-events-none transition-opacity duration-700 opacity-30 group-hover:opacity-60"></div>

              <div className="relative z-10 flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5500] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5500]"></span>
                  </span>
                  <p className="text-[10px] text-[#ff5500] font-bold uppercase tracking-wider">Now Playing</p>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-black shadow-[inset_0_1px_10px_rgba(0,0,0,1)] border border-white/5">
                <iframe
                  key={selectedPlaylist.slug}
                  width="100%"
                  height="350"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  loading="lazy"
                  src={embedUrl}
                  className="w-full relative z-10 block"
                  title={`BTL TV - ${selectedPlaylist.title}`}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────
function HomePage({
  onNavigate,
  onSelectShow,
}: {
  onNavigate: (page: string) => void;
  onSelectShow: (id: string) => void;
}) {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SHOWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scrollContainer = useCallback(
    (key: string, direction: "left" | "right") => {
      const el = document.getElementById(`scroll-${key}`);
      if (!el) return;
      el.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    },
    []
  );

  const devotionalShows = PROGRAMS.filter((p) => p.category === "DEVOTIONAL");
  const talkShows = PROGRAMS.filter((p) => p.category === "TALK SHOW");
  const dramaShows = PROGRAMS.filter((p) => p.category === "DRAMA");

  const hero = HERO_SHOWS[heroIndex];

  return (
    <>
      {/* Hero Carousel */}
      <section className="relative w-full h-[60vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={hero.programId}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img src={hero.image} alt={hero.title} width={1280} height={720} fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="hero-gradient absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-12">
          <div className="max-w-2xl space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={hero.programId}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {hero.programId === "btl-logo" ? (
                  <div className="flex items-center gap-4 mb-4">
                    <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_20px_rgba(229,9,20,0.3)]" />
                  </div>
                ) : (
                  <Badge className="bg-btl-red text-white font-bold text-xs mb-3">
                    <Cross className="h-3 w-3 mr-1" />
                    BTL TV ORIGINAL
                  </Badge>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                  {hero.title}
                </h1>
                <p className="text-btl-red font-semibold text-sm sm:text-base mt-1">
                  {hero.subtitle}
                </p>
                <p className="text-white/70 text-sm sm:text-base mt-3 line-clamp-2 max-w-lg">
                  {(PROGRAMS.find((p) => p.id === hero.programId) || KIDS_PROGRAMS.find((p) => p.id === hero.programId))?.description}
                </p>
                <div className="flex gap-3 mt-5">
                  <Button
                    className="bg-btl-red hover:bg-btl-red-dark text-white font-semibold px-6 min-h-[44px]"
                    onClick={() => hero.programId === "btl-logo" ? onNavigate("shows") : onSelectShow(hero.programId)}
                  >
                    <Play className="h-4 w-4 mr-2 fill-current" />
                    {hero.programId === "btl-logo" ? "Explore Shows" : "Watch Now"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 min-h-[44px]"
                    onClick={() => onNavigate("shows")}
                  >
                    All Shows
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 mt-4">
              {HERO_SHOWS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 min-w-[20px] ${idx === heroIndex ? "w-8 bg-btl-red" : "w-4 bg-white/30 hover:bg-white/50"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now - Same landscape cards */}
      <section className="py-6 md:py-8">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-btl-red" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Trending Now</h2>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => scrollContainer("trending", "left")}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => scrollContainer("trending", "right")}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div
            id="scroll-trending"
            className="flex gap-3 overflow-x-auto hide-scrollbar smooth-scroll pb-2"
          >
            {PROGRAMS.slice(0, 15).map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onClick={() => onSelectShow(program.id)}
                size="small"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Devotional Programs */}
      <ShowSection
        title="Devotional Programs"
        icon={BookOpen}
        programs={devotionalShows}
        sectionKey="devotional"
        scrollContainer={scrollContainer}
        onSelectShow={onSelectShow}
      />

      {/* Talk Shows & Discussions */}
      <ShowSection
        title="Talk Shows & Discussions"
        icon={Mic}
        programs={talkShows}
        sectionKey="talkshow"
        scrollContainer={scrollContainer}
        onSelectShow={onSelectShow}
      />

      {/* Drama Series */}
      <ShowSection
        title="Drama Series"
        icon={Drama}
        programs={dramaShows}
        sectionKey="drama"
        scrollContainer={scrollContainer}
        onSelectShow={onSelectShow}
      />

      {/* Our Partners - 3D Animated Cards */}
      <section className="py-8 md:py-12">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-btl-red/40" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Our Partners</h2>
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
                  {/* Glow effect behind card */}
                  <div className="absolute inset-0 bg-btl-red/0 group-hover:bg-btl-red/15 rounded-2xl blur-xl transition-all duration-500 scale-110" />
                  <Card className="relative bg-btl-card/80 border-btl-card-border hover:border-btl-red/40 transition-all duration-500 flex items-center justify-center p-6 md:p-8 h-32 w-48 md:h-40 md:w-60 backdrop-blur-sm group-hover:shadow-[0_0_30px_rgba(229,9,20,0.15)]">
                    {/* 3D shine overlay */}
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
      </section>

      {/* SoundCloud Section */}
      <SoundCloudSection />

      {/* Urdu Audio Bible Section */}
      <section className="py-8 md:py-12">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-btl-red/40" />
            <Headphones className="h-5 w-5 text-btl-red" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Urdu Audio Bible</h2>
            <div className="h-px w-12 bg-btl-red/40" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-btl-card/60 border-btl-card-border overflow-hidden backdrop-blur-sm">
              <div className="bg-gradient-to-r from-btl-red/10 via-btl-red/5 to-transparent p-4 md:p-5 border-b border-btl-card-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-btl-red/15 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-btl-red" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm md:text-base">Complete Urdu Bible — Audio</h3>
                    <p className="text-[11px] md:text-xs text-muted-foreground">66 books · Old & New Testament · Listen for free</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 md:p-6">
                <UrduBiblePlayer />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// ─── Reusable Show Section (Landscape Cards - Posters Clearly Visible) ─
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

// ─── SHOWS PAGE ──────────────────────────────────────────────────────
function ShowsPage({
  selectedShow,
  onSelectShow,
  onBack,
  playingVideo,
  onPlayVideo,
}: {
  selectedShow: string | null;
  onSelectShow: (id: string) => void;
  onBack: () => void;
  playingVideo: string | null;
  onPlayVideo: (id: string) => void;
}) {
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Show detail view
  if (selectedShow) {
    const program = PROGRAMS.find((p) => p.id === selectedShow) || KIDS_PROGRAMS.find((p) => p.id === selectedShow);
    if (!program) return null;
    const episodes = getEpisodes(selectedShow);

    return (
      <div className="min-h-screen">
        {playingVideo && (
          <div className="w-full aspect-video max-h-[70vh] bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video Player"
            />
          </div>
        )}

        <div className="px-4 md:px-6 py-6">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground mb-4" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shows
          </Button>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/5 lg:w-1/3 shrink-0">
              <div className="relative rounded-lg shadow-xl bg-btl-dark flex items-center justify-center overflow-hidden">
                <img
                  src={program.poster}
                  alt={program.title}
                  width={1280}
                  height={720}
                  loading="lazy"
                  className="w-full object-contain max-h-[50vh]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3">
                  <Badge className="bg-btl-red/90 text-white text-xs font-bold mb-2">{program.category}</Badge>
                  <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">{program.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
                    <Play className="h-3.5 w-3.5" />
                    {episodes.length} Episodes
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <p className="text-muted-foreground text-sm">{program.description}</p>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-4">Episodes</h2>
              <div className="grid gap-3">
                {episodes.map((ep) => (
                  <motion.div
                    key={ep.videoId + ep.position}
                    whileHover={{ scale: 1.01 }}
                    className="cursor-pointer"
                    onClick={() => onPlayVideo(ep.videoId)}
                  >
                    <Card className="bg-btl-card border-btl-card-border hover:border-btl-red/30 transition-all overflow-hidden">
                      <CardContent className="p-3 flex gap-4 items-center">
                        <div className="relative w-40 sm:w-48 shrink-0 aspect-video rounded overflow-hidden bg-black">
                          <img
                            src={ep.thumbnail}
                            alt={decodeHtmlEntities(ep.title)}
                            width={320}
                            height={180}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                            <div className="h-10 w-10 rounded-full bg-btl-red/90 flex items-center justify-center">
                              <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                          <Badge className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0">
                            EP{ep.position}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground line-clamp-2">
                            {decodeHtmlEntities(ep.title)}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">Episode {ep.position}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Shows grid view - same landscape card style
  const allCategories = ["ALL", ...Object.keys(CATEGORIES)];
  const filtered = PROGRAMS.filter((p) => {
    const matchCategory = filterCategory === "ALL" || p.category === filterCategory;
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen px-4 md:px-6 py-6">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">All Shows</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shows..."
            className="pl-10 bg-white/5 border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allCategories.map((cat) => (
            <Button
              key={cat}
              variant={filterCategory === cat ? "default" : "outline"}
              size="sm"
              className={
                filterCategory === cat
                  ? "bg-btl-red hover:bg-btl-red-dark text-white"
                  : "border-border/50 text-muted-foreground hover:text-foreground"
              }
              onClick={() => setFilterCategory(cat)}
            >
              {cat === "ALL" ? "All" : CATEGORIES[cat]?.label || cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Shows Grid - Same landscape cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {filtered.map((program) => (
          <motion.div
            key={program.id}
            whileHover={{ y: -4 }}
            className="cursor-pointer"
            onClick={() => onSelectShow(program.id)}
          >
            <div className="overflow-hidden rounded-md bg-btl-card hover:ring-1 hover:ring-btl-red/30 transition-all">
              <div className="relative aspect-video overflow-hidden">
                <img src={program.poster} alt={program.title} width={320} height={180} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-1.5 left-1.5 bg-btl-red/90 text-white text-[9px] font-bold px-1.5 py-0">
                  {program.category}
                </Badge>
                <div className="absolute bottom-1.5 right-1.5 bg-black/60 rounded-full px-1.5 py-0 text-[9px] text-white flex items-center gap-0.5">
                  <Play className="h-2.5 w-2.5 fill-white" />
                  {getEpisodeCount(program.id)}
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-medium text-[11px] sm:text-xs text-foreground truncate">{program.title}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── LIVE TV PAGE (HLS m3u8) ────────────────────────────────────────
function LiveTVPage() {
  return (
    <div className="min-h-screen">
      {/* Professional Live Header */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-btl-dark via-btl-dark to-btl-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.08),transparent_70%)]" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative flex items-center gap-2">
              <span className="animate-pulse-live inline-block h-3 w-3 rounded-full bg-btl-red shadow-[0_0_12px_rgba(229,9,20,0.6)]" />
              <Badge className="bg-btl-red text-white font-bold text-xs px-3 py-1 animate-pulse shadow-[0_0_16px_rgba(229,9,20,0.3)]">
                LIVE NOW
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Live TV</h1>
          </div>
          <p className="text-muted-foreground text-sm">Watch BTL TV live 24/7 — your source for Christian programming in Urdu.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-2">
        {/* Video Player Container - Netflix Premium Style */}
        <div className="relative rounded-xl overflow-hidden shadow-[0_0_40px_rgba(229,9,20,0.1),0_20px_60px_rgba(0,0,0,0.5)] bg-black border border-white/5">
          <div className="aspect-video w-full">
            <HLSPlayer />
          </div>
          {/* Channel Overlay Bar */}
          <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
            <div className="flex items-center gap-2">
              <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-6 w-auto object-contain opacity-80" />
              <span className="text-white/60 text-xs font-medium">BTL TV — Be The Light Television</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="animate-pulse-live h-2 w-2 rounded-full bg-btl-red" />
              <span className="text-white/60 text-[10px] uppercase tracking-wider font-bold">Live</span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {/* Now Playing */}
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <Flame className="h-5 w-5 text-btl-red" />
                <h3 className="text-lg font-bold text-foreground">Now Playing</h3>
                <Badge className="bg-btl-red text-white text-[10px] px-2 py-0.5 animate-pulse">LIVE</Badge>
              </div>
            </div>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-foreground">BTL TV Live Stream</h4>
                  <p className="text-sm text-muted-foreground mt-1">24/7 Christian programming in Urdu — devotional, talk shows, drama, and more.</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="bg-btl-red hover:bg-btl-red-dark text-white min-h-[44px] shadow-[0_0_20px_rgba(229,9,20,0.2)]"
                    onClick={() => window.open("https://www.youtube.com/@btltv", "_blank")}
                  >
                    <Youtube className="h-4 w-4 mr-2" />
                    YouTube
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Schedule */}
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-btl-red" />
                <h3 className="text-lg font-bold text-foreground">Program Schedule</h3>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {[
                  { time: "6:00 AM", show: "Yesu Sang Sawera (Morning Devotional)" },
                  { time: "8:00 AM", show: "Ochtend met Jezus (Dutch Devotional)" },
                  { time: "10:00 AM", show: "Farman-e-Masih / Masihi Zindagi" },
                  { time: "12:00 PM", show: "Talk Shows & Discussions" },
                  { time: "2:00 PM", show: "Drama Series" },
                  { time: "4:00 PM", show: "Aap Ki Sehat (Health Program)" },
                  { time: "6:00 PM", show: "Documentary & Social Issues" },
                  { time: "8:00 PM", show: "Puray Dil Se (Worship)" },
                  { time: "10:00 PM", show: "Debate & Apologetics" },
                ].map((item) => (
                  <div key={item.time} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors">
                    <span className="text-sm font-mono text-btl-red w-20 shrink-0">{item.time}</span>
                    <span className="text-sm text-foreground">{item.show}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT PAGE ──────────────────────────────────────────────────────
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

// ─── STICHTING PAGE (Professional) ───────────────────────────────────
function StichtingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
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
            <Button
              className="bg-btl-red hover:bg-btl-red-dark text-white font-semibold px-8 min-h-[44px]"
              onClick={() => onNavigate("donation")}
            >
              <Heart className="h-4 w-4 mr-2 fill-current" />
              Support Our Ministry
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── TEAM PAGE (Hierarchical Layout) ─────────────────────────────────
function TeamPage() {
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

// ─── DONATION PAGE (With Amount Selector) ────────────────────────────
function DonationPage() {
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

// ─── REPORTS PAGE ────────────────────────────────────────────────────
function ReportsPage() {
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

// ─── CONTACT PAGE ────────────────────────────────────────────────────
function ContactPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const WHATSAPP_NUMBER = "31685097840"; // Netherlands number with country code

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in your name and message.");
      return;
    }
    // Build the WhatsApp message
    const textParts = [
      subject ? `*Subject: ${subject}*` : "",
      `*Name:* ${name}`,
      "",
      message,
    ].filter(Boolean).join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textParts)}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp...");
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
              <Phone className="h-7 w-7 text-btl-red" />
              <div className="h-px w-12 bg-btl-red/50" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
            <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">We would love to hear from you. Reach out to us through any of the channels below.</p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
        {/* WhatsApp Direct Chat - Primary CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-[#25D366]/15 via-[#25D366]/5 to-transparent p-4 md:p-5 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#25D366]/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#25D366]" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Chat on WhatsApp</h2>
                  <p className="text-xs text-muted-foreground">Send us a message directly — we reply fast!</p>
                </div>
              </div>
            </div>
            <CardContent className="p-5">
              <form onSubmit={handleWhatsAppSend} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Name *</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-btl-dark/50 border-border/50 h-11"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is this about?"
                      className="bg-btl-dark/50 border-border/50 h-11"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message *</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    className="bg-btl-dark/50 border-border/50 min-h-[140px] resize-none"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold h-12 min-h-[44px] text-base"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send via WhatsApp
                </Button>
              </form>

              {/* Quick WhatsApp button */}
              <div className="mt-4 pt-4 border-t border-border/20 text-center">
                <p className="text-xs text-muted-foreground mb-3">Or chat directly without filling the form</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#20bd5a] text-sm font-medium transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Open WhatsApp Chat →
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

// ─── KIDS PAGE ───────────────────────────────────────────────────────
function KidsPage({ onSelectShow }: { onSelectShow: (id: string) => void }) {
  return (
    <div className="min-h-screen">
      {/* Fun Kids Header */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-btl-red/20 via-btl-dark to-btl-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.1),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="h-8 w-8 text-btl-red" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">BTL Kids</h1>
            <p className="text-white/60 text-sm mt-3 max-w-md mx-auto">Fun and faith-filled programs for children — Bible stories, prophecies, and more!</p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {KIDS_PROGRAMS.map((program) => (
            <motion.div
              key={program.id}
              whileHover={{ y: -6, scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => onSelectShow(program.id)}
            >
              <Card className="bg-btl-card border-btl-card-border hover:border-btl-red/30 transition-all overflow-hidden h-full">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={program.poster}
                    alt={program.title}
                    width={320}
                    height={180}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <Badge className="absolute top-2 left-2 bg-btl-red text-black text-[10px] font-bold px-2 py-0.5">
                    KIDS
                  </Badge>
                  <div className="absolute bottom-2 right-2 bg-black/60 rounded-full px-2 py-0.5 text-[10px] text-white flex items-center gap-1">
                    <Play className="h-3 w-3 fill-white" />
                    {getEpisodeCount(program.id)}
                  </div>
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                    <div className="h-14 w-14 rounded-full bg-btl-red/90 flex items-center justify-center shadow-lg">
                      <Play className="h-6 w-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground text-base leading-tight">{program.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{program.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Sparkles className="h-3.5 w-3.5 text-btl-red" />
                    <span className="text-xs text-btl-red font-medium">{getEpisodeCount(program.id)} Episodes</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function BTLApp() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // PWA install detection — Android (beforeinstallprompt) + iOS detection
  useEffect(() => {
    // Use a micro-task to avoid synchronous setState in effect
    const detectPWA = () => {
      // Detect iOS
      const ua = navigator.userAgent;
      const ios = /iPad|iPhone|iPod/.test(ua);
      setIsIos(ios);

      // Detect if already running as standalone PWA
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);

      // Show iOS install banner if on iOS and not standalone
      if (ios && !standalone) {
        const dismissed = sessionStorage.getItem('btl-ios-install-dismissed');
        if (!dismissed) setShowIosInstall(true);
      }
    };

    // Schedule detection after paint
    requestAnimationFrame(detectPWA);

    // Android — capture beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setPwaInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const navigateTo = useCallback((page: string) => {
    if (page === "bible-school") {
      window.location.href = "/bible-school";
      return;
    }
    setCurrentPage(page);
    setSelectedShow(null);
    setPlayingVideo(null);
    // Force close mobile menu with a small delay for smooth animation
    setMobileMenuOpen(false);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const selectShow = useCallback((id: string) => {
    setSelectedShow(id);
    setPlayingVideo(null);
    setCurrentPage("shows");
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handler = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIntroVisible(false), 3800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-btl-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-btl-darker/95 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <button onClick={() => navigateTo("home")} className="flex items-center gap-2 shrink-0">
            <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-8 w-auto object-contain" />
          </button>

          {/* PWA Install — visible in header when available (Android) */}
          {pwaInstallPrompt && !isStandalone && (
            <Button
              className="hidden md:flex bg-btl-red hover:bg-btl-red-dark text-white text-xs h-8 px-3 mr-2"
              onClick={async () => {
                await pwaInstallPrompt.prompt();
                setPwaInstallPrompt(null);
              }}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Install App
            </Button>
          )}
          {/* iOS Install hint in header */}
          {isIos && !isStandalone && showIosInstall && (
            <Button
              className="hidden md:flex bg-btl-red hover:bg-btl-red-dark text-white text-xs h-8 px-3 mr-2"
              onClick={() => {
                toast.info('Tap the Share button (⬆) in Safari, then "Add to Home Screen"');
              }}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Install App
            </Button>
          )}

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.key;
              return (
                <button
                  key={link.key}
                  onClick={() => navigateTo(link.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${isActive
                      ? "bg-btl-red text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-btl-darker border-border/30">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-1 mt-6">
                <button onClick={() => navigateTo("home")} className="mb-4">
                  <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-10 w-auto object-contain" />
                </button>
                {NAV_LINKS.map((link) => {
                  const isActive = currentPage === link.key;
                  return (
                    <button
                      key={link.key}
                      onClick={() => navigateTo(link.key)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                          ? "bg-btl-red text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </button>
                  );
                })}
                {/* PWA Install Button — Android */}
                {pwaInstallPrompt && !isStandalone && (
                  <button
                    onClick={async () => {
                      await pwaInstallPrompt.prompt();
                      setPwaInstallPrompt(null);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-btl-red text-white mt-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Install App
                  </button>
                )}
                {/* PWA Install Button — iOS */}
                {isIos && !isStandalone && showIosInstall && (
                  <button
                    onClick={() => {
                      toast.info('Tap the Share button (⬆) in Safari, then "Add to Home Screen"');
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-btl-red text-white mt-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Install App
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        {currentPage === "home" && (
          <HomePage onNavigate={navigateTo} onSelectShow={selectShow} />
        )}
        {currentPage === "shows" && (
          <ShowsPage
            selectedShow={selectedShow}
            onSelectShow={selectShow}
            onBack={() => { setSelectedShow(null); setPlayingVideo(null); }}
            playingVideo={playingVideo}
            onPlayVideo={setPlayingVideo}
          />
        )}
        {currentPage === "live" && <LiveTVPage />}
        {currentPage === "about" && <AboutPage />}
        {currentPage === "stichting" && <StichtingPage onNavigate={navigateTo} />}
        {currentPage === "team" && <TeamPage />}
        {currentPage === "donation" && <DonationPage />}
        {currentPage === "kids" && <KidsPage onSelectShow={selectShow} />}
        {currentPage === "reports" && <ReportsPage />}
        {currentPage === "contact" && <ContactPage />}

        {/* Footer */}
        <footer className="bg-btl-darker border-t border-border/20 py-3 md:py-6 mt-auto">
          <div className="px-4 md:px-6 max-w-6xl mx-auto">
            {/* Mobile: ultra-compact horizontal layout */}
            <div className="md:hidden space-y-2">
              <div className="flex items-center justify-between">
                <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-5 w-auto object-contain" />
                <div className="flex gap-2">
                  <button className="text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.youtube.com/@btltv", "_blank")}>
                    <Youtube className="h-4 w-4" />
                  </button>
                  <button className="text-muted-foreground hover:text-[#ff5500]" onClick={() => window.open("https://soundcloud.com/user-549013936", "_blank")}>
                    <Disc3 className="h-4 w-4" />
                  </button>
                  <button className="text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.facebook.com/btltv", "_blank")}>
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button className="text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.instagram.com/btltv", "_blank")}>
                    <Instagram className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Mobile nav links — 5 columns single row per group, very compact */}
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {NAV_LINKS.map((link) => (
                  <button key={link.key} onClick={() => navigateTo(link.key)} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground leading-tight">
                Westeinde 21, 8064 AJ Zwartsluis, NL · info@btl-tv.com
              </p>
            </div>

            {/* Desktop footer */}
            <div className="hidden md:grid grid-cols-4 gap-6 mb-6">
              <div>
                <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-8 w-auto object-contain mb-3" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Be The Light Television — spreading the Gospel of Jesus Christ to Urdu-speaking communities worldwide.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Navigation</h4>
                <div className="space-y-1.5">
                  {NAV_LINKS.slice(0, 4).map((link) => (
                    <button key={link.key} onClick={() => navigateTo(link.key)} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">More</h4>
                <div className="space-y-1.5">
                  {NAV_LINKS.slice(4).map((link) => (
                    <button key={link.key} onClick={() => navigateTo(link.key)} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Contact</h4>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p>Westeinde 21, 8064 AJ</p>
                  <p>Zwartsluis, Netherlands</p>
                  <a href="mailto:info@btl-tv.com" className="hover:text-foreground transition-colors">info@btl-tv.com</a>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.youtube.com/@btltv", "_blank")}>
                    <Youtube className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-[#ff5500]" onClick={() => window.open("https://soundcloud.com/user-549013936", "_blank")}>
                    <Disc3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.facebook.com/btltv", "_blank")}>
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-btl-red" onClick={() => window.open("https://www.instagram.com/btltv", "_blank")}>
                    <Instagram className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Separator className="bg-border/20 mb-3 md:mb-4" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] md:text-[11px] text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Stichting Be The Light Television. All rights reserved.</p>
              <p>ANBI RSIN: 857342423 | KvK: 68202377</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full bg-btl-red text-white shadow-lg flex items-center justify-center hover:bg-btl-red-dark transition-all"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {/* Mobile PWA Install Banner — shows at bottom for Android & iOS */}
      {!isStandalone && (pwaInstallPrompt || (isIos && showIosInstall)) && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden">
          <div className="bg-btl-darker/98 backdrop-blur-md border-t border-btl-red/30 px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-btl-red/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-btl-red" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">Install BTL TV App</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {isIos ? 'Tap Share ⬆ then "Add to Home Screen"' : 'Add to home screen for quick access'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {pwaInstallPrompt ? (
                <Button
                  size="sm"
                  className="bg-btl-red hover:bg-btl-red-dark text-white text-xs h-8 px-3"
                  onClick={async () => {
                    await pwaInstallPrompt.prompt();
                    setPwaInstallPrompt(null);
                  }}
                >
                  Install
                </Button>
              ) : isIos ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-btl-red/50 text-btl-red text-xs h-8 px-3"
                  onClick={() => {
                    toast.info('Tap the Share button (⬆) at the bottom of Safari, then select "Add to Home Screen"', { duration: 6000 });
                  }}
                >
                  How?
                </Button>
              ) : null}
              <button
                onClick={() => {
                  if (isIos) {
                    setShowIosInstall(false);
                    sessionStorage.setItem('btl-ios-install-dismissed', '1');
                  }
                  setPwaInstallPrompt(null);
                }}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <Cross className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
