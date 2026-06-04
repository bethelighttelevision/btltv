import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

const ALL_SHOWS = [
  { title: "Debate", slug: "debate", category: "Talk Show", playlistId: "PLC0Rch0KTiEL1XcXiXO76FeMysmOQda-v", thumbnail: "/images/programs/debate.webp", description: "Christian apologetics and theological debates with scholars and experts." },
  { title: "Connection", slug: "connection", category: "Talk Show", playlistId: "PLC0Rch0KTiEL-7g_5Zt4nmcj1tKUMVlDJ", thumbnail: "/images/programs/connection.webp", description: "A youth program connecting faith with everyday life." },
  { title: "295C", slug: "295c", category: "Social Issues", playlistId: "PLC0Rch0KTiEJty_pIPyX862w551dRhSPC", thumbnail: "/images/programs/295c.webp", description: "Discussing Pakistan's blasphemy laws and their impact." },
  { title: "Meri Aawaz Suno", slug: "meri-aawaz-suno", category: "Talk Show", playlistId: "PLC0Rch0KTiEL3jSy9_haZ0IwwVnEOM502", thumbnail: "/images/programs/meri-awaz-suno.webp", description: "Giving voice to the voiceless." },
  { title: "Bol K Lab Azad Hain Tere", slug: "bol-k-lab-azad-hain-tere", category: "Talk Show", playlistId: "PLC0Rch0KTiEJJU9cHbZ_aZHkQuQKtG353", thumbnail: "/images/programs/bol-k-lub-azad-hai-tere.webp", description: "Speak freely — exploring women's roles in the Bible and society." },
  { title: "Ora et Labora", slug: "ora-et-labora", category: "Documentary", playlistId: "PLC0Rch0KTiEK78XGqgSzTgYovHc6M6l3M", thumbnail: "/images/programs/ora-et-labora.webp", description: "Pray and Work — documentary series featuring Christian businesses." },
  { title: "Masihi Zindagi", slug: "masihi-zindagi", category: "Devotional", playlistId: "PLC0Rch0KTiEK2HGhHh6ju0UAbR4GPpv_h", thumbnail: "https://i.ytimg.com/vi/pX1ngNLVn30/hqdefault.jpg", description: "Christian Life — practical teachings on living a faith-filled life." },
  { title: "Yesu Sang Sawera | Pastor Munawar Virk", slug: "yesu-sang-sawera-pastor-munawar-virk", category: "Devotional", playlistId: "PLC0Rch0KTiEJ5atmrt0aNyTJTbBRk8Dtd", thumbnail: "/images/programs/yesu-sang-sawera-pastor-munawar-virk.webp", description: "Morning with Jesus — daily devotional with Pastor Munawar Virk." },
  { title: "Yesu Sang Sawera | Pastor Imran Gill", slug: "yesu-sang-sawera-pastor-imran-gill", category: "Devotional", playlistId: "PLC0Rch0KTiEK59AdKYUxvjD4FYGGAk-3W", thumbnail: "/images/programs/yesu-sang-sawera-pastor-imran-gill.webp", description: "Morning with Jesus — daily devotional with Pastor Imran Gill." },
  { title: "Yesu Sang Sawera | Predikant Imko Postma", slug: "yesu-sang-sawera-predikant-imko-postma", category: "Devotional", playlistId: "PLC0Rch0KTiEJjSOc-b5azFbgnCgy27PFx", thumbnail: "/images/programs/ochtend-met-jezus-predikant-imko-postma.webp", description: "Morning with Jesus — devotional with Predikant Imko Postma." },
  { title: "Yesu Sang Sawera | Pastor Sarfaraz Rehmat", slug: "yesu-sang-sawera-pastor-sarfaraz-rehmat", category: "Devotional", playlistId: "PLC0Rch0KTiEJIkPavJjvPDX1eslj5q2Mt", thumbnail: "/images/programs/yesu-sang-sawera-pastor-sarfaraz-rehmat.webp", description: "Morning with Jesus — daily devotional with Pastor Sarfaraz Rehmat." },
  { title: "Morning With Jesus | Pastor Robert Slack", slug: "morning-with-jesus-pastor-robert-slack", category: "Devotional", playlistId: "PLC0Rch0KTiEIR35NdZTLISgKRMlc3BVw3", thumbnail: "/images/programs/morning-with-jesus-pastor-robert-slack.webp", description: "Morning devotional with Pastor Robert Slack." },
  { title: "Yesu Sang Sawera | Pastor Parvaiz Iqbal", slug: "yesu-sang-sawera-pastor-parvaiz-iqbal", category: "Devotional", playlistId: "PLC0Rch0KTiEI_mnwHqbtFVWkoBepRVJYz", thumbnail: "/images/programs/yesu-sang-sawera-pastor-parvaiz-iqbal.webp", description: "Morning with Jesus — devotional with Pastor Parvaiz Iqbal." },
  { title: "Yesu Sang Sawera | Bishop Emmanuel Aftab", slug: "yesu-sang-sawera-bishop-emmanuel-aftab", category: "Devotional", playlistId: "PLC0Rch0KTiEIM81Nxga6kBzrWTI4zKW6B", thumbnail: "/images/programs/yesu-sang-sawera-bishop-emmanuel-aftab.webp", description: "Morning with Jesus — daily devotional with Bishop Emmanuel Aftab." },
  { title: "Puray Dil Se", slug: "puray-dil-se", category: "Devotional", playlistId: "PLC0Rch0KTiEJmdYO0rgoAyxHvufDMRqey", thumbnail: "/images/programs/puray-dil-se.webp", description: "With All Your Heart — heartfelt worship and devotional program." },
  { title: "Tehqeeq-E-Bible", slug: "tehqeeqebible", category: "Devotional", playlistId: "PLC0Rch0KTiEJf5LpXqJUB7BOPTIxxYE4Y", thumbnail: "https://i.ytimg.com/vi/-vE4aOXdFU8/hqdefault.jpg", description: "Bible Research — in-depth study and investigation of biblical texts." },
  { title: "Farman-e-Masih", slug: "farmanemasih", category: "Devotional", playlistId: "PLC0Rch0KTiEJTLA68BSOZiawjHha_STu6", thumbnail: "/images/programs/farman-e-masih.webp", description: "Commandment of Christ — teachings from the words of Jesus." },
  { title: "Azmat-E-Masih", slug: "azmatemasih", category: "Devotional", playlistId: "PLC0Rch0KTiEKieg3BaUFw9Awo951JERSq", thumbnail: "https://i.ytimg.com/vi/C4Q5lYDdKZg/hqdefault.jpg", description: "Glory of Christ — exploring the majesty and divinity of Jesus Christ." },
  { title: "Choti Si Baat", slug: "choti-si-baat", category: "Talk Show", playlistId: "PLC0Rch0KTiELEXZy_VRdLOII3zDpXYh-m", thumbnail: "/images/programs/choti-si-baat.webp", description: "A Small Matter — conversations about everyday faith and life." },
  { title: "Aao Hamad Karin", slug: "aao-hamad-karin", category: "Devotional", playlistId: "PLC0Rch0KTiEJD0sPwhLDZKTexs0RhHtTk", thumbnail: "https://i.ytimg.com/vi/9JdEOSZFiLs/hqdefault.jpg", description: "Come Let's Praise — worship and praise program." },
  { title: "Yesu Sang Sawera | Pastor Nadeem K Dean", slug: "yesu-sang-sawera-pastor-nadeem-k-dean", category: "Devotional", playlistId: "PLC0Rch0KTiEJzzhjty0HYs02WBzM4Y7G1", thumbnail: "/images/programs/yesu-sang-sawera-pastor-nadeem-k-dean.webp", description: "Morning with Jesus — daily devotional with Pastor Nadeem K Dean." },
  { title: "Daagh", slug: "daagh", category: "Drama", playlistId: "PLC0Rch0KTiEJzd_BEgTrtW25He9bc5ykP", thumbnail: "/images/programs/daag.webp", description: "Stain — drama addressing forced conversions and social injustice." },
  { title: "Meri Kahani", slug: "meri-kahani", category: "Drama", playlistId: "PLC0Rch0KTiEJviSmXh9ffFJ57rLQcS84A", thumbnail: "https://i.ytimg.com/vi/_URLEq-amhM/hqdefault.jpg", description: "My Story — true testimonies of Muslim converts to Christianity." },
  { title: "Bandhan", slug: "bandhan", category: "Drama", playlistId: "PLC0Rch0KTiEKhqfRdSq7N9syvs31FNUQU", thumbnail: "/images/programs/bandhan.webp", description: "Bond — dramatic series exploring relationships and faith." },
  { title: "Aap Ki Sehat", slug: "aap-ki-sehat", category: "Health", playlistId: "PLC0Rch0KTiEIez3wRZiuJ3uIAVeqO8UAk", thumbnail: "/images/programs/aap-ki-sehat.webp", description: "Your Health — health awareness program." },
  { title: "Return Ticket", slug: "return-ticket", category: "Drama", playlistId: "PLC0Rch0KTiEJappsAzGuHckX-6Tnv3e0C", thumbnail: "/images/programs/return-ticket.webp", description: "Drama exploring the journey of life." },
  { title: "Aao Chalein", slug: "aao-chalein", category: "Documentary", playlistId: "PLC0Rch0KTiEIXhIrONRD0BUJOfT02hwOZ", thumbnail: "/images/programs/aao-chalein.webp", description: "Let's Go — documentary on social issues, human rights, and community events." },
  { title: "Safar-e-Shanakhat", slug: "safareshanakhat", category: "Documentary", playlistId: "PLC0Rch0KTiELmNtPpNsAFdD5R0DuHsc57", thumbnail: "/images/programs/safar-e-shanakht.webp", description: "Journey of Identity — documentary exploring Christian identity and heritage." },
  { title: "Career Guide", slug: "career-guide", category: "Education", playlistId: "PLC0Rch0KTiEKFnSQS_7_yzCXlBVE14c9K", thumbnail: "/images/programs/career-guide.webp", description: "Career guidance and professional development for youth." },
  { title: "Hamare Sitare", slug: "hamare-sitare", category: "Talk Show", playlistId: "PLC0Rch0KTiELF-r1NYnvutDhWwFA_PuWb", thumbnail: "/images/programs/hamarey-sitarey.webp", description: "Our Stars — interviews with prominent Christian leaders." },
  { title: "Pakistan Hamara Bhi Hai", slug: "pakistan-hamara-bhi-hai", category: "Social Issues", playlistId: "PLC0Rch0KTiEL62fRR7QFYnybfId__kUGp", thumbnail: "/images/programs/pakistan-hamara-bhi-hai.webp", description: "Pakistan Is Ours Too — advocating for minority rights." },
  { title: "BTL TV News & Updates", slug: "btl-tv-news-updates", category: "News", playlistId: "PLC0Rch0KTiEJ5r54n700_prgbhdZExCJG", thumbnail: "/images/programs/news.webp", description: "Official updates and news from Be The Light Television." },
  { title: "Yesu Sang Sawera | Pastor William Paighani", slug: "yesu-sang-sawera-pastor-william-paighani", category: "Devotional", playlistId: "PLC0Rch0KTiEJU6V0fg9XydpOjM8Yp0eAY", thumbnail: "https://i.ytimg.com/vi/yl1M9TTo0TM/hqdefault.jpg", description: "Morning with Jesus — daily devotional with Pastor William Paighani." },
  { title: "Prophecies About Jesus Christ", slug: "prophecies-about-jesus-christ", category: "Kids", playlistId: "PLC0Rch0KTiEINBNsxKVWV5gXlu8EmlWV0", thumbnail: "https://i.ytimg.com/vi/M_efw5g34gs/hqdefault.jpg", description: "Biblical prophecies about Jesus Christ for children." },
  { title: "Kids Stories", slug: "kids-stories", category: "Kids", playlistId: "PLC0Rch0KTiEJ4Ys17Q2GyDerDxuUkhe2z", thumbnail: "https://i.ytimg.com/vi/3v5dYvZweHg/hqdefault.jpg", description: "Bible stories told in a fun way for kids." },
  { title: "BTL Drama Specials", slug: "btl-drama-specials", category: "Drama", playlistId: "PLC0Rch0KTiEIub8WrDOvvwOfy2VMA8wV2", thumbnail: "https://i.ytimg.com/vi/KF9HGJn_mno/hqdefault.jpg", description: "Special drama productions from BTL TV." },
  { title: "Food for Your Heart", slug: "food-for-your-heart", category: "Devotional", playlistId: "PLC0Rch0KTiEKswX3Uhy-Rbc_v8oZGWoaN", thumbnail: "https://i.ytimg.com/vi/Ul0WTSmDN2M/hqdefault.jpg", description: "Spiritual nourishment for your soul." },
  { title: "Ochtend met Jezus | Predikant Douwe Wijmenga", slug: "ochtend-met-jezus-predikant-douwe-wijmenga", category: "Devotional", playlistId: "PLC0Rch0KTiEJHTsKT-ccjvRsQ7wq0zhNA", thumbnail: "/images/programs/morning-with-jesus-predikant-douwe-wijmenga.webp", description: "Morning devotionals in Dutch with Predikant Douwe Wijmenga." },
  { title: "Ochtend met Jezus | Predikant Terpstra", slug: "ochtend-met-jezus-predikant-terpstra", category: "Devotional", playlistId: "PLC0Rch0KTiEKa9nRM45q3IjtjnEcxx8Oq", thumbnail: "/images/programs/ochtend-met-jezus-pastor-terpstra.webp", description: "Morning devotionals in Dutch with Predikant Terpstra." },
  { title: "Urdu Bible", slug: "urdu-bible", category: "Devotional", playlistId: "PLC0Rch0KTiEIXuKgpvm7mq4YlLQ__HssQ", thumbnail: "https://i.ytimg.com/vi/6bjIhLSE504/hqdefault.jpg", description: "Complete Urdu Bible audio readings." },
];

const TEAM_MEMBERS = [
  { name: "Gasper Daniel", designation: "CEO & Founder", photo: "/images/team/gasper-daniel-ceo.png", displayOrder: 0 },
  { name: "Sumble Noreen", designation: "Vice President", photo: "/images/team/sumble-noreen-vp.png", displayOrder: 1 },
  { name: "Sahir Alam", designation: "Head of Audio & Video", photo: "/images/team/sahir-alam.webp", displayOrder: 2 },
  { name: "Karal Yohana", designation: "Head of Department", photo: "/images/team/karal-yohana-hod.png", displayOrder: 3 },
  { name: "Nayyar Noel", designation: "Co-Ordinator", photo: "/images/team/nayyar-noel.webp", displayOrder: 4 },
  { name: "Khisal Daniel", designation: "Director of Photography", photo: "/images/team/khisal-daniel-dop.png", displayOrder: 5 },
  { name: "Minahil Daniel", designation: "Director of Photography", photo: "/images/team/minahil-daniel-dop.png", displayOrder: 6 },
  { name: "Watson Gill", designation: "Host", photo: "/images/team/watson-gill.webp", displayOrder: 7 },
  { name: "Emmanuel Aftab", designation: "Bishop", photo: "/images/team/emmanuel-aftab.webp", displayOrder: 8 },
  { name: "Douwe Wijmenga", designation: "Predikant", photo: "/images/team/douwe-wijmenga.webp", displayOrder: 9 },
  { name: "Imko Postma", designation: "Predikant", photo: "/images/team/imko-postma.webp", displayOrder: 10 },
  { name: "Imran Gill", designation: "Pastor", photo: "/images/team/imran-gill.webp", displayOrder: 11 },
  { name: "Munawar Virk", designation: "Pastor", photo: "/images/team/munawar-virk.webp", displayOrder: 12 },
  { name: "Nadeem K Dean", designation: "Pastor", photo: "/images/team/nadeem-k-dean.webp", displayOrder: 13 },
  { name: "Parvaiz Iqbal", designation: "Pastor", photo: "/images/team/parvaiz-iqbal.webp", displayOrder: 14 },
  { name: "Robert Slack", designation: "Pastor", photo: "/images/team/robert-slack.webp", displayOrder: 15 },
  { name: "Sarfraz Rehmat", designation: "Pastor", photo: "/images/team/sarfraz-rehmat.webp", displayOrder: 16 },
  { name: "William Paighani", designation: "Pastor", photo: "/images/team/william-paighani.webp", displayOrder: 17 },
  { name: "Lazar Allah Rakha", designation: "Advocate", photo: "/images/team/lazar-allah-rakha.webp", displayOrder: 18 },
  { name: "Sooba Bhatti", designation: "Advocate", photo: "/images/team/sooba-bhatti.webp", displayOrder: 19 },
  { name: "Malook Israel", designation: "News Reporter", photo: "/images/team/malook-israel.webp", displayOrder: 20 },
];

const REVIEWS = [
  { name: "Saira Khan", rating: 5, comment: "BTL TV is a blessing for Urdu-speaking Christians. The programs are inspiring and the live TV feature is amazing! Finally a channel that speaks to our community.", source: "google", isApproved: true },
  { name: "John Masih", rating: 5, comment: "I watch Yesu Sang Sawera every morning. It has transformed my daily devotional life. May God continue to bless this ministry.", source: "google", isApproved: true },
  { name: "Maryam Bhatti", rating: 5, comment: "The Urdu Audio Bible on this platform is incredible. I can listen to God's word in my mother tongue anytime. Highly recommended!", source: "google", isApproved: true },
  { name: "David Gill", rating: 4, comment: "Great content for the Pakistani Christian community. The dramas are particularly well-produced. Would love to see more kids programs.", source: "google", isApproved: true },
  { name: "Ruth Parvez", rating: 5, comment: "This ministry is doing amazing work. The talk shows address real issues faced by Christians in Pakistan. BTL TV is a voice for the voiceless.", source: "google", isApproved: true },
  { name: "Tariq Alexander", rating: 5, comment: "I downloaded the APK and the app works perfectly. Being able to watch Christian content in Urdu on my phone is wonderful. God bless BTL TV!", source: "google", isApproved: true },
  { name: "Nazia Daniel", rating: 4, comment: "The programs are very informative and spiritually uplifting. The quality of production keeps improving. Keep up the great work!", source: "google", isApproved: true },
  { name: "Samuel Yousaf", rating: 5, comment: "Finally a Christian television platform that truly understands the Urdu-speaking community. Every program is thoughtfully created. Highly blessed!", source: "google", isApproved: true },
];

export async function GET() { return POST(); }

export async function POST() {
  try {
    let msg = "";
    const { hash } = await import("bcryptjs");
    const passwordHash = await hash("BTL@2026Admin!", 12);
    await prisma.user.upsert({
      where: { email: "bethelighttelevision@gmail.com" },
      update: { passwordHash, name: "Admin" },
      create: { name: "Admin", email: "bethelighttelevision@gmail.com", passwordHash },
    });
    msg += "Admin account ready. ";

    for (let i = 0; i < ALL_SHOWS.length; i++) {
      const s = ALL_SHOWS[i];
      await prisma.show.upsert({
        where: { slug: s.slug },
        update: { ...s, order: i, isActive: true },
        create: { ...s, order: i },
      });
    }
    msg += `${ALL_SHOWS.length} shows seeded. `;

    const existingMembers = await prisma.teamMember.count();
    if (existingMembers === 0) {
      for (const m of TEAM_MEMBERS) {
        await prisma.teamMember.create({ data: m });
      }
      msg += `${TEAM_MEMBERS.length} team members seeded.`;
    } else {
      msg += `Team members already exist (${existingMembers}).`;
    }

    for (const r of REVIEWS) {
      await prisma.review.create({ data: r });
    }
    msg += `${REVIEWS.length} reviews seeded.`;

    return NextResponse.json({ message: msg });
  } catch (e) { return apiError(e); }
}
