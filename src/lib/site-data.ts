"use client";

import episodesData from "@/lib/episodes-data.json";
import {
  Tv,
  Play,
  Flame,
  BookMarked,
  BookOpen,
  Building2,
  Users,
  Baby,
  Heart,
  FileText,
  Phone,
  Mic,
  Drama,
  Globe,
  Shield,
  Stethoscope,
  GraduationCap,
  Newspaper,
  Crown,
  Briefcase,
  Gavel,
} from "lucide-react";
import type { ElementType } from "react";

// ─── Types ───────────────────────────────────────────────────────────
export interface Episode {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  position: number;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  poster: string;
  category: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  description?: string;
  group: string;
  objectPosition?: string;
}

// PWA beforeinstallprompt event type
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// ─── Desktop Nav Items ────────────────────────────────────────────────
export interface NavItem {
  key: string;
  label: string;
  href: string;
}

export const DESKTOP_NAV: NavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "shows", label: "Shows", href: "/shows" },
  { key: "live", label: "Live TV", href: "/live" },
  { key: "bible-school", label: "Bible School", href: "/bible-school" },
  { key: "about", label: "About", href: "/about" },
];

export const MORE_ITEMS: NavItem[] = [
  { key: "stichting", label: "Stichting", href: "/stichting" },
  { key: "team", label: "Team", href: "/team" },
  { key: "kids", label: "Kids", href: "/kids" },
  { key: "donation", label: "Donation", href: "/donation" },
  { key: "reports", label: "Reports", href: "/reports" },
  { key: "contact", label: "Contact", href: "/contact" },
];

// Legacy flat nav links (for footer, backward compat)
export const NAV_LINKS = [
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
  { key: "download", label: "Download App", icon: Smartphone },
];

// ─── Programs Data ───────────────────────────────────────────────────
export const PROGRAMS: Program[] = [
  {
    id: "PLC0Rch0KTiEL1XcXiXO76FeMysmOQda-v",
    title: "Debate",
    slug: "debate",
    poster: "/images/programs/debate.webp",
    category: "TALK SHOW",
    description: "Christian apologetics and theological debates with scholars and experts.",
  },
  {
    id: "PLC0Rch0KTiEL-7g_5Zt4nmcj1tKUMVlDJ",
    title: "Connection",
    slug: "connection",
    poster: "/images/programs/connection.webp",
    category: "TALK SHOW",
    description: "A youth program connecting faith with everyday life and biblical truths.",
  },
  {
    id: "PLC0Rch0KTiEJty_pIPyX862w551dRhSPC",
    title: "295C",
    slug: "295c",
    poster: "/images/programs/295c.webp",
    category: "SOCIAL ISSUES",
    description: "Discussing Pakistan's blasphemy laws and their impact on minority communities.",
  },
  {
    id: "PLC0Rch0KTiEL3jSy9_haZ0IwwVnEOM502",
    title: "Meri Aawaz Suno",
    slug: "meri-aawaz-suno",
    poster: "/images/programs/meri-awaz-suno.webp",
    category: "TALK SHOW",
    description: "Giving voice to the voiceless — highlighting injustice and advocating for the oppressed.",
  },
  {
    id: "PLC0Rch0KTiEJJU9cHbZ_aZHkQuQKtG353",
    title: "Bol K Lab Azad Hain Tere",
    slug: "bol-k-lab-azad-hain-tere",
    poster: "/images/programs/bol-k-lub-azad-hai-tere.webp",
    category: "TALK SHOW",
    description: "Speak freely — exploring women's roles in the Bible and society.",
  },
  {
    id: "PLC0Rch0KTiEK78XGqgSzTgYovHc6M6l3M",
    title: "Ora et Labora",
    slug: "ora-et-labora",
    poster: "/images/programs/ora-et-labora.webp",
    category: "DOCUMENTARY",
    description: "Pray and Work — documentary series featuring Christian businesses and their faith journeys.",
  },
  {
    id: "PLC0Rch0KTiEJHTsKT-ccjvRsQ7wq0zhNA",
    title: "Ochtend met Jezus | Predikant Douwe Wijmenga",
    slug: "ochtend-met-jezus-predikant-douwe-wijmenga",
    poster: "/images/programs/morning-with-jesus-predikant-douwe-wijmenga.webp",
    category: "DEVOTIONAL",
    description: "Morning devotionals in Dutch with Predikant Douwe Wijmenga, studying the Gospel of Mark.",
  },
  {
    id: "PLC0Rch0KTiEK2HGhHh6ju0UAbR4GPpv_h",
    title: "Masihi Zindagi",
    slug: "masihi-zindagi",
    poster: "https://i.ytimg.com/vi/pX1ngNLVn30/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Christian Life — practical teachings on living a faith-filled life.",
  },
  {
    id: "PLC0Rch0KTiEJ5atmrt0aNyTJTbBRk8Dtd",
    title: "Yesu Sang Sawera | Pastor Munawar Virk",
    slug: "yesu-sang-sawera-pastor-munawar-virk",
    poster: "/images/programs/yesu-sang-sawera-pastor-munawar-virk.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Pastor Munawar Virk.",
  },
  {
    id: "PLC0Rch0KTiEK59AdKYUxvjD4FYGGAk-3W",
    title: "Yesu Sang Sawera | Pastor Imran Gill",
    slug: "yesu-sang-sawera-pastor-imran-gill",
    poster: "/images/programs/yesu-sang-sawera-pastor-imran-gill.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Pastor Imran Gill.",
  },
  {
    id: "PLC0Rch0KTiEJjSOc-b5azFbgnCgy27PFx",
    title: "Yesu Sang Sawera | Predikant Imko Postma",
    slug: "yesu-sang-sawera-predikant-imko-postma",
    poster: "/images/programs/ochtend-met-jezus-predikant-imko-postma.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — devotional with Predikant Imko Postma.",
  },
  {
    id: "PLC0Rch0KTiEJIkPavJjvPDX1eslj5q2Mt",
    title: "Yesu Sang Sawera | Pastor Sarfaraz Rehmat",
    slug: "yesu-sang-sawera-pastor-sarfaraz-rehmat",
    poster: "/images/programs/yesu-sang-sawera-pastor-sarfaraz-rehmat.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Pastor Sarfaraz Rehmat.",
  },
  {
    id: "PLC0Rch0KTiEIR35NdZTLISgKRMlc3BVw3",
    title: "Morning With Jesus | Pastor Robert Slack",
    slug: "morning-with-jesus-pastor-robert-slack",
    poster: "/images/programs/morning-with-jesus-pastor-robert-slack.webp",
    category: "DEVOTIONAL",
    description: "Morning devotional with Pastor Robert Slack.",
  },
  {
    id: "PLC0Rch0KTiEKa9nRM45q3IjtjnEcxx8Oq",
    title: "Ochtend met Jezus | Predikant Terpstra",
    slug: "ochtend-met-jezus-predikant-terpstra",
    poster: "/images/programs/ochtend-met-jezus-pastor-terpstra.webp",
    category: "DEVOTIONAL",
    description: "Morning devotionals in Dutch with Predikant Terpstra.",
  },
  {
    id: "PLC0Rch0KTiEI_mnwHqbtFVWkoBepRVJYz",
    title: "Yesu Sang Sawera | Pastor Parvaiz Iqbal",
    slug: "yesu-sang-sawera-pastor-parvaiz-iqbal",
    poster: "/images/programs/yesu-sang-sawera-pastor-parvaiz-iqbal.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — devotional through the liturgical calendar with Pastor Parvaiz Iqbal.",
  },
  {
    id: "PLC0Rch0KTiEIM81Nxga6kBzrWTI4zKW6B",
    title: "Yesu Sang Sawera | Bishop Emmanuel Aftab",
    slug: "yesu-sang-sawera-bishop-emmanuel-aftab",
    poster: "/images/programs/yesu-sang-sawera-bishop-emmanuel-aftab.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Bishop Emmanuel Aftab.",
  },
  {
    id: "PLC0Rch0KTiEJmdYO0rgoAyxHvufDMRqey",
    title: "Puray Dil Se",
    slug: "puray-dil-se",
    poster: "/images/programs/puray-dil-se.webp",
    category: "DEVOTIONAL",
    description: "With All Your Heart — heartfelt worship and devotional program.",
  },
  {
    id: "PLC0Rch0KTiEJf5LpXqJUB7BOPTIxxYE4Y",
    title: "Tehqeeq-E-Bible",
    slug: "tehqeeqebible",
    poster: "https://i.ytimg.com/vi/-vE4aOXdFU8/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Bible Research — in-depth study and investigation of biblical texts.",
  },
  {
    id: "PLC0Rch0KTiEJTLA68BSOZiawjHha_STu6",
    title: "Farman-e-Masih",
    slug: "farmanemasih",
    poster: "/images/programs/farman-e-masih.webp",
    category: "DEVOTIONAL",
    description: "Commandment of Christ — teachings from the words of Jesus.",
  },
  {
    id: "PLC0Rch0KTiEKieg3BaUFw9Awo951JERSq",
    title: "Azmat-E-Masih",
    slug: "azmatemasih",
    poster: "https://i.ytimg.com/vi/C4Q5lYDdKZg/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Glory of Christ — exploring the majesty and divinity of Jesus Christ.",
  },
  {
    id: "PLC0Rch0KTiELEXZy_VRdLOII3zDpXYh-m",
    title: "Choti Si Baat",
    slug: "choti-si-baat",
    poster: "/images/programs/choti-si-baat.webp",
    category: "TALK SHOW",
    description: "A Small Matter — conversations about everyday faith and life.",
  },
  {
    id: "PLC0Rch0KTiEJD0sPwhLDZKTexs0RhHtTk",
    title: "Aao Hamad Karin",
    slug: "aao-hamad-karin",
    poster: "https://i.ytimg.com/vi/9JdEOSZFiLs/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Come Let's Praise — worship and praise program.",
  },
  {
    id: "PLC0Rch0KTiEKswX3Uhy-Rbc_v8oZGWoaN",
    title: "Food for Your Heart",
    slug: "food-for-your-heart",
    poster: "https://i.ytimg.com/vi/Ul0WTSmDN2M/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Spiritual nourishment for your soul — health and faith combined.",
  },
  {
    id: "PLC0Rch0KTiEJzzhjty0HYs02WBzM4Y7G1",
    title: "Yesu Sang Sawera | Pastor Nadeem K Dean",
    slug: "yesu-sang-sawera-pastor-nadeem-k-dean",
    poster: "/images/programs/yesu-sang-sawera-pastor-nadeem-k-dean.webp",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Pastor Nadeem K Dean.",
  },
  {
    id: "PLC0Rch0KTiEJzd_BEgTrtW25He9bc5ykP",
    title: "Daagh",
    slug: "daagh",
    poster: "/images/programs/daag.webp",
    category: "DRAMA",
    description: "Stain — drama addressing forced conversions and social injustice.",
  },
  {
    id: "PLC0Rch0KTiEJviSmXh9ffFJ57rLQcS84A",
    title: "Meri Kahani",
    slug: "meri-kahani",
    poster: "https://i.ytimg.com/vi/_URLEq-amhM/hqdefault.jpg",
    category: "DRAMA",
    description: "My Story — true testimonies of Muslim converts to Christianity.",
  },
  {
    id: "PLC0Rch0KTiEKhqfRdSq7N9syvs31FNUQU",
    title: "Bandhan",
    slug: "bandhan",
    poster: "/images/programs/bandhan.webp",
    category: "DRAMA",
    description: "Bond — dramatic series exploring relationships and faith.",
  },
  {
    id: "PLC0Rch0KTiEIub8WrDOvvwOfy2VMA8wV2",
    title: "BTL Drama Specials",
    slug: "btl-drama-specials",
    poster: "https://i.ytimg.com/vi/KF9HGJn_mno/hqdefault.jpg",
    category: "DRAMA",
    description: "Special drama productions and short stories from BTL TV.",
  },
  {
    id: "PLC0Rch0KTiEIez3wRZiuJ3uIAVeqO8UAk",
    title: "Aap Ki Sehat",
    slug: "aap-ki-sehat",
    poster: "/images/programs/aap-ki-sehat.webp",
    category: "HEALTH",
    description: "Your Health — health awareness program covering mental and physical wellbeing.",
  },
  {
    id: "PLC0Rch0KTiEJappsAzGuHckX-6Tnv3e0C",
    title: "Return Ticket",
    slug: "return-ticket",
    poster: "/images/programs/return-ticket.webp",
    category: "DRAMA",
    description: "Drama exploring the journey of life — are we physical or spiritual beings?",
  },
  {
    id: "PLC0Rch0KTiEIXhIrONRD0BUJOfT02hwOZ",
    title: "Aao Chalein",
    slug: "aao-chalein",
    poster: "/images/programs/aao-chalein.webp",
    category: "DOCUMENTARY",
    description: "Let's Go — documentary covering social issues, human rights, and community events.",
  },
  {
    id: "PLC0Rch0KTiEJJUdDkkF1ErTjG92L6u4bq",
    title: "Such Ki Khooj",
    slug: "such-ki-khooj",
    poster: "https://i.ytimg.com/vi/1x6dYFEObWM/hqdefault.jpg",
    category: "DOCUMENTARY",
    description: "Search for Truth — investigative series exploring truth and faith.",
  },
  {
    id: "PLC0Rch0KTiELmNtPpNsAFdD5R0DuHsc57",
    title: "Safar-e-Shanakhat",
    slug: "safareshanakhat",
    poster: "/images/programs/safar-e-shanakht.webp",
    category: "DOCUMENTARY",
    description: "Journey of Identity — documentary exploring Christian identity and heritage.",
  },
  {
    id: "PLC0Rch0KTiEKFnSQS_7_yzCXlBVE14c9K",
    title: "Career Guide",
    slug: "career-guide",
    poster: "/images/programs/career-guide.webp",
    category: "EDUCATION",
    description: "Career guidance and professional development for youth.",
  },
  {
    id: "PLC0Rch0KTiELF-r1NYnvutDhWwFA_PuWb",
    title: "Hamare Sitare",
    slug: "hamare-sitare",
    poster: "/images/programs/hamarey-sitarey.webp",
    category: "TALK SHOW",
    description: "Our Stars — interviews with prominent Christian leaders and personalities.",
  },
  {
    id: "PLC0Rch0KTiEL62fRR7QFYnybfId__kUGp",
    title: "Pakistan Hamara Bhi Hai",
    slug: "pakistan-hamara-bhi-hai",
    poster: "/images/programs/pakistan-hamara-bhi-hai.webp",
    category: "SOCIAL ISSUES",
    description: "Pakistan Is Ours Too — advocating for minority rights and equal citizenship.",
  },
  {
    id: "PLC0Rch0KTiEJ5r54n700_prgbhdZExCJG",
    title: "BTL TV News & Updates",
    slug: "btl-tv-news-updates",
    poster: "/images/programs/news.webp",
    category: "NEWS",
    description: "Official updates and news from Be The Light Television.",
  },
  {
    id: "PLC0Rch0KTiEJU6V0fg9XydpOjM8Yp0eAY",
    title: "Yesu Sang Sawera | Pastor William Paighani",
    slug: "yesu-sang-sawera-pastor-william-paighani",
    poster: "https://i.ytimg.com/vi/yl1M9TTo0TM/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Morning with Jesus — daily devotional with Pastor William Paighani.",
  },
  {
    id: "PLC0Rch0KTiEIXuKgpvm7mq4YlLQ__HssQ",
    title: "Urdu Bible",
    slug: "urdu-bible",
    poster: "https://i.ytimg.com/vi/6bjIhLSE504/hqdefault.jpg",
    category: "DEVOTIONAL",
    description: "Complete Urdu Bible — audio readings of Genesis, Exodus, Proverbs, Gospels, and more.",
  },
];

// ─── Kids Programs ───────────────────────────────────────────────────
export const KIDS_PROGRAMS: Program[] = [
  {
    id: "PLC0Rch0KTiEINBNsxKVWV5gXlu8EmlWV0",
    title: "Prophecies About Jesus Christ",
    slug: "prophecies-about-jesus-christ",
    poster: "https://i.ytimg.com/vi/M_efw5g34gs/hqdefault.jpg",
    category: "KIDS",
    description: "Biblical prophecies about Jesus Christ explained for children.",
  },
  {
    id: "PLC0Rch0KTiEJ4Ys17Q2GyDerDxuUkhe2z",
    title: "Kids Stories",
    slug: "kids-stories",
    poster: "https://i.ytimg.com/vi/3v5dYvZweHg/hqdefault.jpg",
    category: "KIDS",
    description: "Bible stories told in a fun and engaging way for kids.",
  },
  {
    id: "PLC0Rch0KTiELwlkkreDtcIdxhPmASJbpJ",
    title: "Kids Programe | Bible Study",
    slug: "kids-programe-bible-study",
    poster: "https://i.ytimg.com/vi/j0CU07nX-vg/hqdefault.jpg",
    category: "KIDS",
    description: "Bible study programs designed specially for children.",
  },
];

// ─── Category info ───────────────────────────────────────────────────
export const CATEGORIES: Record<string, { label: string; icon: ElementType; color: string }> = {
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
export const TEAM_GROUPS = [
  {
    title: "Leadership",
    icon: Crown,
    members: [
      { name: "Gasper Daniel", role: "CEO & Founder", image: "/images/team/gasper-daniel-ceo.png" },
      { name: "Sumble Noreen", role: "Vice President", image: "/images/team/sumble-noreen-vp.png" },
      { name: "Sahir Alam", role: "Head of Audio & Video", image: "/images/team/sahir-alam.webp" },
    ],
  },
  {
    title: "Office",
    icon: Briefcase,
    members: [
      { name: "Karal Yohana", role: "Head of Department", image: "/images/team/karal-yohana-hod.png" },
      { name: "Nayyar Noel", role: "Co-Ordinator", image: "/images/team/nayyar-noel.webp" },
      { name: "Khisal Daniel", role: "Director of Photography", image: "/images/team/khisal-daniel-dop.png" },
      { name: "Minahil Daniel", role: "Director of Photography", image: "/images/team/minahil-daniel-dop.png" },
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
export const TEAM_MEMBERS: TeamMember[] = TEAM_GROUPS.flatMap((g) =>
  g.members.map((m) => ({ ...m, group: g.title }))
);

// ─── Partners ────────────────────────────────────────────────────────
export const PARTNERS = [
  { name: "De Fontein", logo: "/images/partners/de-fontein.webp" },
  { name: "GKU PKN Urk", logo: "/images/partners/gku-pkn-urk.webp" },
  { name: "Verre Naasten", logo: "/images/partners/verre-naasten.webp" },
];

// ─── Hero featured shows ────────────────────────────────────────────
export const HERO_SHOWS = [
  { programId: "btl-logo", title: "BTL TV", subtitle: "Be The Light Television", image: "/images/programs/banner-image.webp" },
  { programId: "PLC0Rch0KTiEJmdYO0rgoAyxHvufDMRqey", title: "Puray Dil Se", subtitle: "With All Your Heart", image: "/images/programs/banner-image.webp" },
  { programId: "PLC0Rch0KTiEJty_pIPyX862w551dRhSPC", title: "295C", subtitle: "Social Justice Program", image: "/images/programs/295c.webp" },
  { programId: "PLC0Rch0KTiEJJU9cHbZ_aZHkQuQKtG353", title: "Bol K Lab Azad Hain Tere", subtitle: "Speak Freely", image: "/images/programs/bol-k-lub-azad-hai-tere.webp" },
  { programId: "PLC0Rch0KTiEJappsAzGuHckX-6Tnv3e0C", title: "Return Ticket", subtitle: "Drama Series", image: "/images/programs/return-ticket.webp" },
  { programId: "PLC0Rch0KTiEL3jSy9_haZ0IwwVnEOM502", title: "Meri Aawaz Suno", subtitle: "Hear My Voice", image: "/images/programs/meri-awaz-suno.webp" },
  { programId: "PLC0Rch0KTiEK78XGqgSzTgYovHc6M6l3M", title: "Ora et Labora", subtitle: "Pray & Work", image: "/images/programs/ora-et-labora.webp" },
];

// ─── Reports ─────────────────────────────────────────────────────────
export const ANNUAL_REPORTS = [
  { title: "Annual Report 2024", year: "2024", file: "/reports/Reports BTL Tv/Financieel_verslag_2024.pdf" },
  { title: "Annual Report 2023", year: "2023", file: "/reports/Reports BTL Tv/Financieel_verslag_2023.pdf" },
  { title: "Annual Report 2022", year: "2022", file: "/reports/Reports BTL Tv/Financieel_verslag_2022.pdf" },
  { title: "Annual Report 2021", year: "2021", file: "/reports/Reports BTL Tv/Financieel_verslag_2021.pdf" },
  { title: "Annual Report 2020", year: "2020", file: "/reports/Reports BTL Tv/Financieel_verslag_2020.pdf" },
  { title: "Annual Report 2019", year: "2019", file: "/reports/Reports BTL Tv/Financieel_verslag_2019.pdf" },
  { title: "Annual Report 2018", year: "2018", file: "/reports/Reports BTL Tv/Financieel_verslag_2018.pdf" },
  { title: "Annual Report 2017", year: "2017", file: "/reports/Reports BTL Tv/Financieel_verslag_2017.pdf" },
];

export const OTHER_REPORTS = [
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
export function getEpisodes(playlistId: string): Episode[] {
  return (episodesData.episodes as Record<string, Episode[]>)[playlistId] || [];
}

export function getEpisodeCount(playlistId: string): number {
  return getEpisodes(playlistId).length;
}

export const ALL_SHOWS: Program[] = [...PROGRAMS, ...KIDS_PROGRAMS];

export function getProgramBySlug(slug: string): Program | undefined {
  return ALL_SHOWS.find((p) => p.slug === slug);
}

export function getProgramById(id: string): Program | undefined {
  return ALL_SHOWS.find((p) => p.id === id);
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// ─── Urdu Audio Bible Player ─────────────────────────────────────────
export const BIBLE_BOOKS = [
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
export const GBC_AUDIO_MAP: Record<string, string> = {
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

// ─── SoundCloud Playlists ─────────────────────────────────────────────
export const SOUNDCLOUD_PLAYLISTS = [
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
