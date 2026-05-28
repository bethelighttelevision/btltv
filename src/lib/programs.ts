import episodesData from "@/lib/episodes-data.json";

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

// ─── Programs Data ───────────────────────────────────────────────────
export const PROGRAMS: Program[] = [
  { id: "PLC0Rch0KTiEL1XcXiXO76FeMysmOQda-v", title: "Debate", slug: "debate", poster: "/images/programs/debate.webp", category: "TALK SHOW", description: "Christian apologetics and theological debates with scholars and experts." },
  { id: "PLC0Rch0KTiEL-7g_5Zt4nmcj1tKUMVlDJ", title: "Connection", slug: "connection", poster: "/images/programs/connection.webp", category: "TALK SHOW", description: "A youth program connecting faith with everyday life and biblical truths." },
  { id: "PLC0Rch0KTiEJty_pIPyX862w551dRhSPC", title: "295C", slug: "295c", poster: "/images/programs/295c.webp", category: "SOCIAL ISSUES", description: "Discussing Pakistan's blasphemy laws and their impact on minority communities." },
  { id: "PLC0Rch0KTiEL3jSy9_haZ0IwwVnEOM502", title: "Meri Aawaz Suno", slug: "meri-aawaz-suno", poster: "/images/programs/meri-awaz-suno.webp", category: "TALK SHOW", description: "Giving voice to the voiceless — highlighting injustice and advocating for the oppressed." },
  { id: "PLC0Rch0KTiEJJU9cHbZ_aZHkQuQKtG353", title: "Bol K Lab Azad Hain Tere", slug: "bol-k-lab-azad-hain-tere", poster: "/images/programs/bol-k-lub-azad-hai-tere.webp", category: "TALK SHOW", description: "Speak freely — exploring women's roles in the Bible and society." },
  { id: "PLC0Rch0KTiEK78XGqgSzTgYovHc6M6l3M", title: "Ora et Labora", slug: "ora-et-labora", poster: "/images/programs/ora-et-labora.webp", category: "DOCUMENTARY", description: "Pray and Work — documentary series featuring Christian businesses and their faith journeys." },
  { id: "PLC0Rch0KTiEJHTsKT-ccjvRsQ7wq0zhNA", title: "Ochtend met Jezus | Predikant Douwe Wijmenga", slug: "ochtend-met-jezus-predikant-douwe-wijmenga", poster: "/images/programs/morning-with-jesus-predikant-douwe-wijmenga.webp", category: "DEVOTIONAL", description: "Morning devotionals in Dutch with Predikant Douwe Wijmenga, studying the Gospel of Mark." },
  { id: "PLC0Rch0KTiEK2HGhHh6ju0UAbR4GPpv_h", title: "Masihi Zindagi", slug: "masihi-zindagi", poster: "https://i.ytimg.com/vi/pX1ngNLVn30/hqdefault.jpg", category: "DEVOTIONAL", description: "Christian Life — practical teachings on living a faith-filled life." },
  { id: "PLC0Rch0KTiEJ5atmrt0aNyTJTbBRk8Dtd", title: "Yesu Sang Sawera | Pastor Munawar Virk", slug: "yesu-sang-sawera-pastor-munawar-virk", poster: "/images/programs/yesu-sang-sawera-pastor-munawar-virk.webp", category: "DEVOTIONAL", description: "Morning with Jesus — daily devotional with Pastor Munawar Virk." },
  { id: "PLC0Rch0KTiEK59AdKYUxvjD4FYGGAk-3W", title: "Yesu Sang Sawera | Pastor Imran Gill", slug: "yesu-sang-sawera-pastor-imran-gill", poster: "/images/programs/yesu-sang-sawera-pastor-imran-gill.webp", category: "DEVOTIONAL", description: "Morning with Jesus — daily devotional with Pastor Imran Gill." },
  { id: "PLC0Rch0KTiEJjSOc-b5azFbgnCgy27PFx", title: "Yesu Sang Sawera | Predikant Imko Postma", slug: "yesu-sang-sawera-predikant-imko-postma", poster: "/images/programs/ochtend-met-jezus-predikant-imko-postma.webp", category: "DEVOTIONAL", description: "Morning with Jesus — devotional with Predikant Imko Postma." },
  { id: "PLC0Rch0KTiEJIkPavJjvPDX1eslj5q2Mt", title: "Yesu Sang Sawera | Pastor Sarfaraz Rehmat", slug: "yesu-sang-sawera-pastor-sarfaraz-rehmat", poster: "/images/programs/yesu-sang-sawera-pastor-sarfaraz-rehmat.webp", category: "DEVOTIONAL", description: "Morning with Jesus — daily devotional with Pastor Sarfaraz Rehmat (80 episodes)." },
  { id: "PLC0Rch0KTiEIR35NdZTLISgKRMlc3BVw3", title: "Morning With Jesus | Pastor Robert Slack", slug: "morning-with-jesus-pastor-robert-slack", poster: "/images/programs/morning-with-jesus-pastor-robert-slack.webp", category: "DEVOTIONAL", description: "Morning devotional with Pastor Robert Slack." },
  { id: "PLC0Rch0KTiEKa9nRM45q3IjtjnEcxx8Oq", title: "Ochtend met Jezus | Predikant Terpstra", slug: "ochtend-met-jezus-predikant-terpstra", poster: "/images/programs/ochtend-met-jezus-pastor-terpstra.webp", category: "DEVOTIONAL", description: "Morning devotionals in Dutch with Predikant Terpstra." },
  { id: "PLC0Rch0KTiEI_mnwHqbtFVWkoBepRVJYz", title: "Yesu Sang Sawera | Pastor Parvaiz Iqbal", slug: "yesu-sang-sawera-pastor-parvaiz-iqbal", poster: "/images/programs/yesu-sang-sawera-pastor-parvaiz-iqbal.webp", category: "DEVOTIONAL", description: "Morning with Jesus — devotional through the liturgical calendar with Pastor Parvaiz Iqbal." },
  { id: "PLC0Rch0KTiEIM81Nxga6kBzrWTI4zKW6B", title: "Yesu Sang Sawera | Bishop Emmanuel Aftab", slug: "yesu-sang-sawera-bishop-emmanuel-aftab", poster: "/images/programs/yesu-sang-sawera-bishop-emmanuel-aftab.webp", category: "DEVOTIONAL", description: "Morning with Jesus — daily devotional with Bishop Emmanuel Aftab." },
  { id: "PLC0Rch0KTiEJmdYO0rgoAyxHvufDMRqey", title: "Puray Dil Se", slug: "puray-dil-se", poster: "/images/programs/puray-dil-se.webp", category: "DEVOTIONAL", description: "With All Your Heart — heartfelt worship and devotional program." },
  { id: "PLC0Rch0KTiEJf5LpXqJUB7BOPTIxxYE4Y", title: "Tehqeeq-E-Bible", slug: "tehqeeq-e-bible", poster: "https://i.ytimg.com/vi/-vE4aOXdFU8/hqdefault.jpg", category: "DEVOTIONAL", description: "Bible Research — in-depth study and investigation of biblical texts." },
  { id: "PLC0Rch0KTiEJTLA68BSOZiawjHha_STu6", title: "Farman-e-Masih", slug: "farman-e-masih", poster: "/images/programs/farman-e-masih.webp", category: "DEVOTIONAL", description: "Commandment of Christ — teachings from the words of Jesus." },
  { id: "PLC0Rch0KTiEKieg3BaUFw9Awo951JERSq", title: "Azmat-E-Masih", slug: "azmat-e-masih", poster: "https://i.ytimg.com/vi/C4Q5lYDdKZg/hqdefault.jpg", category: "DEVOTIONAL", description: "Glory of Christ — exploring the majesty and divinity of Jesus Christ." },
  { id: "PLC0Rch0KTiELEXZy_VRdLOII3zDpXYh-m", title: "Choti Si Baat", slug: "choti-si-baat", poster: "/images/programs/choti-si-baat.webp", category: "TALK SHOW", description: "A Small Matter — conversations about everyday faith and life." },
  { id: "PLC0Rch0KTiEJD0sPwhLDZKTexs0RhHtTk", title: "Aao Hamad Karin", slug: "aao-hamad-karin", poster: "https://i.ytimg.com/vi/9JdEOSZFiLs/hqdefault.jpg", category: "DEVOTIONAL", description: "Come Let's Praise — worship and praise program." },
  { id: "PLC0Rch0KTiEKswX3Uhy-Rbc_v8oZGWoaN", title: "Food for Your Heart", slug: "food-for-your-heart", poster: "https://i.ytimg.com/vi/Ul0WTSmDN2M/hqdefault.jpg", category: "DEVOTIONAL", description: "Spiritual nourishment for your soul — health and faith combined." },
  { id: "PLC0Rch0KTiEJzzhjty0HYs02WBzM4Y7G1", title: "Yesu Sang Sawera | Pastor Nadeem K Dean", slug: "yesu-sang-sawera-pastor-nadeem-k-dean", poster: "/images/programs/yesu-sang-sawera-pastor-nadeem-k-dean.webp", category: "DEVOTIONAL", description: "Morning with Jesus — daily devotional with Pastor Nadeem K Dean." },
  { id: "PLC0Rch0KTiEJzd_BEgTrtW25He9bc5ykP", title: "Daagh", slug: "daagh", poster: "/images/programs/daag.webp", category: "DRAMA", description: "Stain — drama addressing forced conversions and social injustice." },
  { id: "PLC0Rch0KTiEJviSmXh9ffFJ57rLQcS84A", title: "Meri Kahani", slug: "meri-kahani", poster: "https://i.ytimg.com/vi/_URLEq-amhM/hqdefault.jpg", category: "DRAMA", description: "My Story — true testimonies of Muslim converts to Christianity." },
  { id: "PLC0Rch0KTiEKhqfRdSq7N9syvs31FNUQU", title: "Bandhan", slug: "bandhan", poster: "/images/programs/bandhan.webp", category: "DRAMA", description: "Bond — dramatic series exploring relationships and faith." },
  { id: "PLC0Rch0KTiEIub8WrDOvvwOfy2VMA8wV2", title: "BTL Drama Specials", slug: "btl-drama-specials", poster: "https://i.ytimg.com/vi/KF9HGJn_mno/hqdefault.jpg", category: "DRAMA", description: "Special drama productions and short stories from BTL TV." },
  { id: "PLC0Rch0KTiEIez3wRZiuJ3uIAVeqO8UAk", title: "Aap Ki Sehat", slug: "aap-ki-sehat", poster: "/images/programs/aap-ki-sehat.webp", category: "HEALTH", description: "Your Health — health awareness program covering mental and physical wellbeing." },
  { id: "PLC0Rch0KTiEJappsAzGuHckX-6Tnv3e0C", title: "Return Ticket", slug: "return-ticket", poster: "/images/programs/return-ticket.webp", category: "DRAMA", description: "Drama exploring the journey of life — are we physical or spiritual beings?" },
  { id: "PLC0Rch0KTiEIXhIrONRD0BUJOfT02hwOZ", title: "Aao Chalein", slug: "aao-chalein", poster: "/images/programs/aao-chalein.webp", category: "DOCUMENTARY", description: "Let's Go — documentary covering social issues, human rights, and community events." },
  { id: "PLC0Rch0KTiEJJUdDkkF1ErTjG92L6u4bq", title: "Such Ki Khooj", slug: "such-ki-khooj", poster: "https://i.ytimg.com/vi/1x6dYFEObWM/hqdefault.jpg", category: "DOCUMENTARY", description: "Search for Truth — investigative series exploring truth and faith." },
  { id: "PLC0Rch0KTiELmNtPpNsAFdD5R0DuHsc57", title: "Safar-e-Shanakhat", slug: "safar-e-shanakhat", poster: "/images/programs/safar-e-shanakht.webp", category: "DOCUMENTARY", description: "Journey of Identity — documentary exploring Christian identity and heritage." },
  { id: "PLC0Rch0KTiEKFnSQS_7_yzCXlBVE14c9K", title: "Career Guide", slug: "career-guide", poster: "/images/programs/career-guide.webp", category: "EDUCATION", description: "Career guidance and professional development for youth." },
  { id: "PLC0Rch0KTiELF-r1NYnvutDhWwFA_PuWb", title: "Hamare Sitare", slug: "hamare-sitare", poster: "/images/programs/hamarey-sitarey.webp", category: "TALK SHOW", description: "Our Stars — interviews with prominent Christian leaders and personalities." },
  { id: "PLC0Rch0KTiEL62fRR7QFYnybfId__kUGp", title: "Pakistan Hamara Bhi Hai", slug: "pakistan-hamara-bhi-hai", poster: "/images/programs/pakistan-hamara-bhi-hai.webp", category: "SOCIAL ISSUES", description: "Pakistan Is Ours Too — advocating for minority rights and equal citizenship." },
  { id: "PLC0Rch0KTiEJ5r54n700_prgbhdZExCJG", title: "BTL TV News & Updates", slug: "btl-tv-news-updates", poster: "/images/programs/news.webp", category: "NEWS", description: "Official updates and news from Be The Light Television." },

  { id: "PLC0Rch0KTiEJU6V0fg9XydpOjM8Yp0eAY", title: "Yesu Sang Sawera | Pastor William Paighani", slug: "yesu-sang-sawera-pastor-william-paighani", poster: "https://i.ytimg.com/vi/yl1M9TTo0TM/hqdefault.jpg", category: "DEVOTIONAL", description: "Morning with Jesus — daily devotional with Pastor William Paighani." },
  { id: "PLC0Rch0KTiEIXuKgpvm7mq4YlLQ__HssQ", title: "Urdu Bible", slug: "urdu-bible", poster: "https://i.ytimg.com/vi/6bjIhLSE504/hqdefault.jpg", category: "DEVOTIONAL", description: "Complete Urdu Bible — audio readings of Genesis, Exodus, Proverbs, Gospels, and more." },
];

export const KIDS_PROGRAMS: Program[] = [
  { id: "PLC0Rch0KTiEINBNsxKVWV5gXlu8EmlWV0", title: "Prophecies About Jesus Christ", slug: "prophecies-about-jesus-christ", poster: "https://i.ytimg.com/vi/M_efw5g34gs/hqdefault.jpg", category: "KIDS", description: "Biblical prophecies about Jesus Christ explained for children." },
  { id: "PLC0Rch0KTiEJ4Ys17Q2GyDerDxuUkhe2z", title: "Kids Stories", slug: "kids-stories", poster: "https://i.ytimg.com/vi/3v5dYvZweHg/hqdefault.jpg", category: "KIDS", description: "Bible stories told in a fun and engaging way for kids." },
  { id: "PLC0Rch0KTiELwlkkreDtcIdxhPmASJbpJ", title: "Kids Programe | Bible Study", slug: "kids-programe-bible-study", poster: "https://i.ytimg.com/vi/j0CU07nX-vg/hqdefault.jpg", category: "KIDS", description: "Bible study programs designed specially for children." },
];

export const ALL_SHOWS: Program[] = [...PROGRAMS, ...KIDS_PROGRAMS];

// ─── Helpers ─────────────────────────────────────────────────────────
export function getEpisodes(playlistId: string): Episode[] {
  return (episodesData.episodes as Record<string, Episode[]>)[playlistId] || [];
}

export function getEpisodeCount(playlistId: string): number {
  return getEpisodes(playlistId).length;
}

export function getProgramBySlug(slug: string): Program | undefined {
  return ALL_SHOWS.find((p) => p.slug === slug);
}

export function getProgramById(id: string): Program | undefined {
  return ALL_SHOWS.find((p) => p.id === id);
}
