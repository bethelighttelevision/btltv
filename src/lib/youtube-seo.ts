export interface SEOOutput {
  title: string;
  description: string;
  tags: string;
}

interface TitleKeywords {
  words: string[];
  bigrams: string[];
  persons: string[];
  topics: string[];
}

function extractKeywords(title: string): TitleKeywords {
  const cleaned = title
    .replace(/[|/:;!@#$%^&*()\-–—\[\]{}""''„“»«,.]/g, " ")
    .replace(/\b(btl|tv)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(/\s+/).filter((w) => w.length > 2);
  const unique = [...new Set(words.map((w) => w.toLowerCase()))];
  const bigrams: string[] = [];
  for (let i = 0; i < unique.length - 1; i++) {
    bigrams.push(`${unique[i]} ${unique[i + 1]}`);
  }

  const personPrefixes = ["advocate", "dr", "prof", "pastor", "reverend", "rev", "fr", "brother", "sister", "bishop", "mr", "mrs", "ms"];
  const persons: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i].toLowerCase().replace(/[^a-z]/g, "");
    if (personPrefixes.includes(w) && words[i + 1]) {
      const name = [words[i], words[i + 1]].join(" ");
      if (words[i + 2] && /^[A-Z]/.test(words[i + 2])) {
        persons.push([words[i], words[i + 1], words[i + 2]].join(" "));
      } else {
        persons.push(name);
      }
    }
    if (/^[A-Z]/.test(words[i]) && words[i + 1] && /^[A-Z]/.test(words[i + 1])) {
      const potential = `${words[i]} ${words[i + 1]}`;
      if (!personPrefixes.includes(words[i].toLowerCase())) {
        persons.push(potential);
      }
    }
  }

  const topics = unique.filter((w) => w.length > 4 && !personPrefixes.includes(w));

  return { words: unique, bigrams, persons: [...new Set(persons)], topics: [...new Set(topics)] };
}

function pick<T>(arr: T[], count: number): T[] {
  return arr.sort(() => Math.random() - 0.5).slice(0, count);
}

function generateTitle(title: string, category: string): string {
  const kw = extractKeywords(title);
  let clean = title
    .replace(/\|\s*[^|]+\|\s*btl\s*tv\s*$/i, "")
    .replace(/[|]\s*btl\s*tv\b.*$/i, "")
    .replace(/\s*-\s*btl\s*tv\b.*$/i, "")
    .replace(/\s+btl\s*tv\b.*$/i, "")
    .replace(/^btl\s*tv\s*[|–\-–]\s*/i, "")
    .replace(/^btl\s*tv\s*/i, "")
    .replace(/\s*\|\s*$/, "")
    .trim();
  if (!clean) clean = title;

  const powerPrefixes: Record<string, string[]> = {
    devotional: ["Start Your Day With", "Powerful Morning Prayer", "Blessed Morning"],
    bible: ["Deep Dive Into", "Understanding", "Bible Study"],
    drama: ["Watch Full Episode", "Powerful Christian Drama", "Must-Watch Episode"],
    talk: ["Exclusive Talk", "Must-Watch Discussion", "Important Conversation"],
    news: ["Breaking News", "Urgent Update", "Latest News"],
    social: ["Urgent Issue", "Important Message", "Critical Discussion"],
    documentary: ["Full Documentary", "In-Depth Story", "Exclusive Documentary"],
    kids: ["Fun Bible Story", "Kids Bible Lesson", "Learn With Fun"],
    health: ["Health Tips", "Wellness Guide", "Stay Healthy"],
    worship: ["Beautiful Worship", "Soulful Praise", "Uplifting Song"],
    testimony: ["Amazing Testimony", "Powerful Story", "God Is Good"],
    education: ["Learn & Grow", "Educational Video", "Knowledge Session"],
  };

  const powers = powerPrefixes[category] || [];
  const prefix = powers.length > 0 && clean.length < 50 ? pick(powers, 1)[0] : null;

  if (prefix && !clean.toLowerCase().startsWith(prefix.toLowerCase().split(" ")[0])) {
    return `${prefix} | ${clean} | BTL TV`;
  }

  const suffix: Record<string, string> = {
    devotional: "Daily Devotional | BTL TV",
    bible: "Bible Study in Urdu | BTL TV",
    drama: "Christian Drama | BTL TV",
    talk: "Christian Talk Show | BTL TV",
    news: "Christian News | BTL TV",
    social: "Christian Perspective | BTL TV",
    documentary: "Christian Documentary | BTL TV",
    kids: "Bible Stories for Kids | BTL TV",
    health: "Health & Wellness | BTL TV",
    worship: "Christian Worship | BTL TV",
    testimony: "Powerful Testimony | BTL TV",
    education: "Christian Education | BTL TV",
    other: "BTL TV",
  };

  return `${clean} | ${suffix[category] || "BTL TV"}`;
}

function generateHook(title: string, category: string, kw: TitleKeywords): string {
  const cleanTitle = title.replace(/[|]\s*btl\s*tv\b.*$/i, "").replace(/\bbtl\s*tv\b.*$/i, "").trim();
  const firstPerson = kw.persons[0] || "";
  const firstTopic = kw.topics[0] || "";
  const personName = firstPerson || cleanTitle;

  const hooks: Record<string, string[]> = {
    devotional: [
      `Start your morning with this powerful Urdu devotional by BTL TV. "${cleanTitle}" will fill your heart with peace, faith, and God's love.`,
    ],
    bible: [
      `Dive deep into God's Word with this Urdu Bible study from BTL TV. ${firstTopic ? `In this session, we explore the topic of "${firstTopic}"` : ""} and uncover biblical truths that will transform your faith.`,
    ],
    drama: [
      `Watch the full episode of "${cleanTitle}" — a powerful Christian drama presented by BTL TV. This emotional story of faith, hope, and redemption will touch your heart.`,
    ],
    talk: [
      `${firstPerson ? `Watch this exclusive discussion with ${firstPerson}` : `Join this important discussion on BTL TV`} as we explore meaningful topics from a Christian perspective. ${firstTopic ? `Today's topic: ${firstTopic}.` : ""}`,
    ],
    news: [
      `${cleanTitle} — BTL TV brings you the latest update. Stay informed about the news that matters most to the Christian community in Pakistan and worldwide.`,
    ],
    social: [
      `BTL TV addresses the critical issue of ${firstTopic || "social justice"} in this special program. ${firstPerson ? `${firstPerson} shares insights and analysis.` : ""} Watch, understand, and make a difference.`,
    ],
    documentary: [
      `Watch this inspiring documentary from BTL TV. "${cleanTitle}" explores ${firstTopic || "powerful stories of faith and heritage"} in the Urdu-speaking Christian community.`,
    ],
    kids: [
      `Teach your children God's Word with "${cleanTitle}" from BTL TV Kids. A fun and engaging Bible story that will help your kids grow in faith.`,
    ],
    health: [
      `${firstTopic ? `Learn about ${firstTopic}` : "Discover health and wellness tips"} from a Christian perspective on BTL TV. Your body is God's temple — take care of it!`,
    ],
    worship: [
      `Lift your heart in worship with "${cleanTitle}" from BTL TV. Let this beautiful song draw you closer to God's presence.`,
    ],
    testimony: [
      `Be inspired by this powerful testimony on BTL TV. ${firstPerson ? `${firstPerson} shares how God transformed their life.` : "Watch how God is working in the lives of His people."} Don't miss this amazing story of faith.`,
    ],
    education: [
      `Expand your knowledge with this educational program from BTL TV. ${cleanTitle} — learn new skills, gain wisdom, and grow in your calling.`,
    ],
    other: [
      `Watch "${cleanTitle}" on BTL TV — Pakistan's first Urdu Christian television channel, broadcasting from the Netherlands since 2017.`,
    ],
  };

  const catHooks = hooks[category] || hooks.other;
  return catHooks[0];
}

function generateBody(category: string, kw: TitleKeywords, title: string): string {
  const cleanTitle = title.replace(/[|]\s*btl\s*tv\b.*$/i, "").replace(/\bbtl\s*tv\b.*$/i, "").trim();
  const firstPerson = kw.persons[0] || "";
  const topics = kw.topics.slice(0, 3);

  const bodies: Record<string, string> = {
    devotional: `In this episode of Yesu Sang Sawera, we bring you a powerful time of prayer, worship, and reflection. Whether you are starting your day or taking a moment to pause, let this devotional strengthen your relationship with God.`,
    bible: `This teaching will help you understand the Scriptures more deeply. ${topics.length > 0 ? `We focus on key themes including ${topics.join(", ")}` : ""}. Perfect for personal study, small groups, and church Bible studies.`,
    drama: `BTL TV brings you high-quality Christian dramas that address real-life issues through the lens of faith. ${topics.length > 0 ? `This episode touches on ${topics.join(", ")}` : ""}. Share this with your family and friends.`,
    talk: `BTL TV hosts candid conversations with pastors, community leaders, and experts. ${firstPerson ? `${firstPerson} shares valuable insights ` : ""}${topics.length > 0 ? `on ${topics.join(", ")}` : ""}. Don't miss this enlightening discussion.`,
    news: `BTL TV News keeps you informed about the latest developments affecting Christians in Pakistan and around the world. ${firstPerson ? `${firstPerson} provides expert analysis` : ""} in this comprehensive update.`,
    social: `BTL TV stands with the Christian community in Pakistan. This program ${firstPerson ? `features ${firstPerson} discussing ` : "addresses "}${topics.length > 0 ? topics.join(", ") : "important social issues"}. Watch and share to spread awareness.`,
    documentary: `This documentary ${firstPerson ? `features ${firstPerson} and explores ` : "explores "}${topics.length > 0 ? topics.join(", ") : "the rich heritage of the Urdu-speaking Christian community"}. An inspiring story you don't want to miss.`,
    kids: `BTL TV Kids presents engaging Bible stories and Christian content for children. ${cleanTitle} teaches valuable lessons about God's love, faith, and obedience in a fun and age-appropriate way.`,
    health: `BTL TV brings you health and wellness advice from a Christian perspective. ${topics.length > 0 ? `Learn about ${topics.join(", ")}` : "Discover practical tips for healthy living"} and take care of the body God gave you.`,
    worship: `${cleanTitle} is a beautiful worship experience brought to you by BTL TV. Let the words and melody minister to your soul and draw you into God's presence. Sing along and be blessed.`,
    testimony: `${firstPerson ? `${firstPerson} shares an incredible testimony of God's faithfulness. ` : "Hear an incredible testimony of God's grace and power. "}This story will encourage your faith and remind you that nothing is impossible with God.`,
    education: `BTL TV is committed to helping you grow. ${cleanTitle} provides valuable knowledge and practical skills ${topics.length > 0 ? `in ${topics.join(", ")}` : "for your personal and spiritual development"}. Invest in your future today.`,
    other: `BTL TV brings you inspiring Christian content in Urdu. ${firstPerson ? `${firstPerson} feature${firstPerson.endsWith("s") ? "" : "s"} in this program.` : ""} Tune in for blessing and encouragement.`,
  };

  return bodies[category] || bodies.other;
}

function generateDescription(title: string, category: string): string {
  const kw = extractKeywords(title);
  const cleanTitle = title.replace(/[|]\s*btl\s*tv\b.*$/i, "").replace(/\bbtl\s*tv\b.*$/i, "").trim();

  const hook = generateHook(title, category, kw);
  const body = generateBody(category, kw, title);

  const CHANNEL_LINKS = [
    "",
    "📡 Watch Live: https://btl-tv.com/live",
    "📖 Bible School: https://btl-tv.com/bible-school",
    "🙏 Support Us: https://www.geef.nl/nl/doneer?charity=9949",
    "",
    "🔵 Facebook: https://www.facebook.com/btltvofficial",
    "📸 Instagram: https://www.instagram.com/btltv",
    "⭐ Google Review: https://g.page/r/CS8tSbX-fni-EBM/review",
    "📧 Email: info@btl-tv.com",
    "",
    "🔔 SUBSCRIBE for daily Urdu Christian content",
    "",
  ].join("\n");

  return [
    hook,
    "",
    body,
    "",
    "📅 About This Program",
    cleanTitle,
    "",
    "✨ About BTL TV",
    "Be The Light Television (BTL TV) is a Netherlands-registered ANBI Christian ministry broadcasting Urdu programming worldwide since 2017. We reach Urdu-speaking communities with the Gospel of Jesus Christ through television, satellite, and digital media.",
    CHANNEL_LINKS,
    "Subscribe & hit the bell to never miss an update",
    "",
    generateHashtags(category),
  ].join("\n");
}

function generateHashtags(category: string): string {
  const base = ["#BTLTV", "#UrduChristian", "#ChristianTV", "#UrduBible", "#YesuSangSawera", "#ChristianMinistry", "#JesusChrist", "#Gospel", "#Faith", "#BibleStudy"];

  const catTags: Record<string, string[]> = {
    devotional: ["#DailyDevotional", "#MorningPrayer", "#UrduDevotional", "#PrayerTime", "#ChristianDevotion"],
    bible: ["#BibleTeaching", "#UrduBibleStudy", "#Scripture", "#WordOfGod", "#BibleVerse"],
    drama: ["#ChristianDrama", "#UrduDrama", "#FaithStory", "#ChristianSeries", "#MasihiDrama"],
    talk: ["#ChristianTalkShow", "#PanelDiscussion", "#ChristianInterview", "#FaithTalk", "#ChurchTalk"],
    news: ["#ChristianNews", "#PakistanNews", "#ChurchNews", "#MinorityRights", "#GospelNews"],
    social: ["#MinorityRights", "#SocialJustice", "#PakistanChristian", "#ReligiousFreedom", "#HumanRights"],
    documentary: ["#ChristianDocumentary", "#FaithDocumentary", "#InspiringStory", "#UrduDocumentary", "#Ministry"],
    kids: ["#KidsBible", "#ChildrenMinistry", "#BibleForKids", "#SundaySchool", "#ChristianKids"],
    health: ["#ChristianHealth", "#Wellness", "#HealthyLiving", "#FaithAndHealth", "#BodyTemple"],
    worship: ["#ChristianWorship", "#PraiseAndWorship", "#UrduWorship", "#WorshipSong", "#ChurchMusic"],
    testimony: ["#ChristianTestimony", "#Miracle", "#GodIsGood", "#TestimonyVideo", "#AnsweredPrayer"],
    education: ["#ChristianEducation", "#LearnAndGrow", "#BibleEducation", "#FaithAndLearning", "#OnlineLearning"],
    other: ["#ChristianVideo", "#UrduVideo", "#FaithContent", "#ChurchOnline", "#GospelMessage"],
  };

  return [...base, ...(catTags[category] || catTags.other)].join(" ");
}

function generateTags(title: string, category: string): string {
  const kw = extractKeywords(title);

  const baseTags = [
    "btl tv", "be the light television", "urdu christian channel", "christian tv",
    "urdu bible", "christian television", "masihi tv", "urdu gospel", "jesus christ",
  ];

  const catSpecific: Record<string, string[]> = {
    devotional: ["daily devotional", "morning prayer", "urdu devotional", "yesu sang sawera", "morning devotion", "prayer time", "devotional video", "spiritual growth", "christian devotion"],
    bible: ["bible study", "bible teaching", "urdu bible study", "learn bible", "bible lesson", "scripture study", "bible verse", "word of god", "bible in urdu"],
    drama: ["christian drama", "urdu drama", "masihi drama", "christian series", "faith drama", "bible story drama", "inspirational drama", "christian film", "drama episode"],
    talk: ["christian talk show", "panel discussion", "christian interview", "pastor interview", "faith discussion", "religious talk", "church discussion", "urdu talk show"],
    news: ["christian news", "urdu news", "pakistan news", "church news", "minority news", "christian update", "religious news", "gospel news", "community news"],
    social: ["minority rights", "forced conversion", "blasphemy law", "christian persecution", "human rights", "social justice", "religious freedom", "christian rights", "pakistan christian"],
    documentary: ["christian documentary", "faith documentary", "ministry documentary", "religious documentary", "urdu documentary", "inspiring story", "christian film", "faith story"],
    kids: ["kids bible", "children bible", "bible stories", "kids christian", "sunday school", "bible for kids", "children ministry", "urdu kids", "christian kids"],
    health: ["christian health", "health tips", "wellness tips", "healthy living", "faith and health", "christian wellness", "health advice", "body temple", "mental health"],
    worship: ["christian worship", "worship song", "praise song", "urdu worship", "christian music", "gospel song", "worship music", "praise and worship", "church music"],
    testimony: ["christian testimony", "miracle story", "healing testimony", "god miracle", "faith story", "conversion testimony", "power of prayer", "testimony video", "answered prayer"],
    education: ["christian education", "learning", "education program", "skill development", "christian learning", "faith and education", "online learning", "bible education"],
    other: ["christian video", "urdu video", "religious program", "faith based", "inspirational", "church online", "gospel message", "spiritual growth"],
  };

  const titleWords = kw.words
    .filter((w) => w.length > 2 && !["the", "and", "for", "with", "this", "that", "from", "your", "what", "when", "where"].includes(w))
    .map((w) => w.toLowerCase());

  const titlePhrases = kw.bigrams
    .filter((p) => {
      const words = p.split(" ");
      return words.every((w) => w.length > 2) && words.length === 2;
    })
    .slice(0, 5)
    .map((p) => p.toLowerCase());

  const titleTags = [...titleWords.slice(0, 5), ...titlePhrases];

  const trending = catSpecific[category] || catSpecific.other;
  const allTags = [...baseTags, ...trending, ...titleTags].filter((t) => t.length > 1);

  return [...new Set(allTags)].join(", ");
}

export function generateSEO(title: string): SEOOutput {
  const category = detectCategory(title);
  return {
    title: generateTitle(title, category),
    description: generateDescription(title, category),
    tags: generateTags(title, category),
  };
}

function detectCategory(title: string): string {
  const t = title.toLowerCase();
  if (/\byesu sang sawera\b|\bmorning with jesus\b|\bmorning devotional\b|\bdevotion\b|\bprayer\b|\bdevo\b/i.test(t)) return "devotional";
  if (/\bbible\b|\bscripture\b|\bgenesis\b|\bexodus\b|\bgospel\b|\bluke\b|\bjohn\b|\bpaul\b|\bpsalm\b|\bproverb\b|\bstudy\b|\bteaching\b|\btheology\b/i.test(t)) return "bible";
  if (/\bdrama\b|\bepisode\b|\bbandhan\b|\bdaagh?\b|\bstory\b|\bkahan?\b/i.test(t)) return "drama";
  if (/\binterview\b|\btalk\b|\bdiscussion\b|\bconversation\b|\bpanel\b|\bchat\b/i.test(t)) return "talk";
  if (/\bnews\b|\bupdate\b|\breport\b|\bbreaking\b/i.test(t)) return "news";
  if (/\bprotest\b|\bconversion\b|\bminority\b|\bblasphemy\b|\binary\b|\bjustice\b|\blegal\b|\bcourt\b|\blaw\b|\bpetition\b/i.test(t)) return "social";
  if (/\bdocumentary\b|\bfeature\b|\bfilm\b/i.test(t)) return "documentary";
  if (/\bkid\b|\bchild\b|\bbaby\b|\bschool\b|\bcartoon\b|\banimation\b/i.test(t)) return "kids";
  if (/\bhealth\b|\bsehat\b|\bmedical\b|\bdoctor\b|\bdisease\b/i.test(t)) return "health";
  if (/\bworship\b|\bpraise\b|\bsong\b|\bsinging\b|\bmusic\b|\bchoir\b|\btarana\b|\bgeet\b|\bhamad\b/i.test(t)) return "worship";
  if (/\btestimonial\b|\btestimony\b|\bmiracles?\b|\bhealing\b/i.test(t)) return "testimony";
  if (/\beducation\b|\bcareer\b|\bguide\b|\bcourse\b|\bclass\b|\blecture\b/i.test(t)) return "education";
  return "other";
}

export const CHANNEL_TAGS = "btl tv, be the light television, urdu christian channel, christian tv, urdu bible, bible study urdu, masihi tv, yesu sang sawera, christian television, urdu gospel, pakistani christian, jesus christ, christian ministry, bible teaching, live christian tv, christian drama, audio bible urdu, minority rights pakistan, christian channel, masihi channel";

export const CHANNEL_DESCRIPTION = [
  "BTL TV (Be The Light Television) is a Netherlands-registered Christian ministry broadcasting Urdu programming to the world since 2017. We exist to reach Urdu-speaking communities with the Gospel of Jesus Christ through television, satellite, and digital media.",
  "",
  "We produce daily devotionals, Bible teaching, talk shows, Christian dramas, news, and children's programs — all in Urdu.",
  "",
  "📡 Watch Live: https://btl-tv.com/live",
  "📖 Bible School: https://btl-tv.com/bible-school", 
  "🙏 Support Us: https://www.geef.nl/nl/doneer?charity=9949",
  "",
  "🔵 Facebook: https://www.facebook.com/btltvofficial",
  "📸 Instagram: https://www.instagram.com/btltv",
  "⭐ Google Review: https://g.page/r/CS8tSbX-fni-EBM/review",
  "",
  "SUBSCRIBE and join our community!",
  "",
  "#BTLTV #UrduChristian #ChristianTV #UrduBible #YesuSangSawera",
].join("\n");
