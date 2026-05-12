"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  isHtml?: boolean;
}

// ─── MASSIVE LOCAL KNOWLEDGE BASE ───
// The bot will search the user's input for any of these keywords.
const KNOWLEDGE_BASE = [
  // Live Support / Contact
  {
    keywords: ["support", "help", "contact", "whatsapp", "email", "phone", "insaan", "human", "madad", "rabta"],
    answer: "Agar aap humari support team, pastors, ya BTL TV ke numaindon se baat karna chahte hain, toh kripya Contact page par jayen ya humein WhatsApp karein: <br/><br/><a href='/contact' class='text-btl-red underline font-bold'>Contact Page Par Jayen</a>"
  },
  
  // BTL TV Core Info
  {
    keywords: ["btl", "btl tv", "btltv", "be the light", "channel", "about", "who are you", "tum kon ho"],
    answer: "BTL TV (Be The Light Television) ek Masihi (Christian) channel hai jo Urdu zaban mein Pakistan aur poori duniya ke liye broadcast karta hai. Humara maqsad Khuda ke kalaam ko media ke zariye phailana hai. Main BTL TV ka AI Assistant hoon."
  },
  {
    keywords: ["live", "tv", "broadcast", "watch", "dekhna"],
    answer: "Aap humara 24/7 Live TV broadcast website ke 'Live TV' section mein dekh sakte hain. <a href='#' onclick='window.scrollTo(0,0)' class='text-btl-red underline'>Abhi Live Dekhein</a>"
  },
  {
    keywords: ["donate", "donation", "fund", "hadiya", "pesa", "support ministry", "give"],
    answer: "Aapki madad humari ministry ke liye bohot ahmiyat rakhti hai. Aap apna hadiya (donation) bhej kar BTL TV ki khidmat mein hissa le sakte hain. <a href='#' class='text-btl-red underline'>Donation page par jayen.</a>"
  },
  {
    keywords: ["app", "download", "mobile", "android", "ios", "iphone"],
    answer: "Aap is website ko apne phone mein 'Install App' par click karke (ya browser menu se Add to Home Screen karke) mobile app ki tarah use kar sakte hain!"
  },

  // BTL TV Shows & Content
  {
    keywords: ["show", "program", "drama", "movie", "film", "kalam", "geet", "song", "music", "worship"],
    answer: "BTL TV par bohot se behtareen programs chalte hain: <br/>- <b>Morning With Jesus</b><br/>- <b>Yesu Sang Sawera</b><br/>- <b>Bible Messages</b><br/>- <b>Masihi Dramas & Movies</b><br/>Aap homepage ke 'Shows' section mein ye sab dekh sakte hain!"
  },
  {
    keywords: ["morning with jesus", "yesu sang sawera", "morning"],
    answer: "'Morning With Jesus' aur 'Yesu Sang Sawera' humare bohot maqbool subah ke programs hain jismein roohani paigham, geet, aur duayen shamil hoti hain. Aap inhe humari site par dekh sakte hain."
  },

  // Bible School & Courses
  {
    keywords: ["school", "course", "study", "certificate", "seekhna", "padhna", "class", "admission"],
    answer: "BTL Bible School ek muft online platform hai jahan aap Bible ki bunyadi taleemat seekh sakte hain aur Course mukammal karne par Certificate hasil kar sakte hain. Menu se 'Bible School' par click karein aur free mein enroll hon!"
  },

  // The Urdu Audio Bible
  {
    keywords: ["bible", "khat-e-muqaddas", "audio bible", "sunna", "sunni", "audio", "mp3", "kalam", "word of god"],
    answer: "Aap humari website par <b>Pura Khat-e-Muqaddas (Urdu Audio Bible)</b> sun sakte hain! Puraana aur Naya Ahd-nama dono majood hain, jise GBC Pakistan ne record kiya hai. Homepage par 'Urdu Bible' player check karein."
  },

  // Deep Bible History & Theology
  {
    keywords: ["history", "tareekh", "tarikh"],
    answer: "Bible ki tareekh bohot wasee hai! Bible (Khat-e-Muqaddas) 66 kitabon ka majmooa hai jise takreeban 40 mukhtalif logon ne 1500 saal ke arse mein Khuda ke rooh ki hidayat se likha. Aap Puranay Ahd-Name (Old Testament) ya Naye Ahd-Name (New Testament) ya kisi khaas Nabi ki tareekh ke bare mein pooch sakte hain."
  },
  {
    keywords: ["old testament", "purana", "puranay", "ahd nama", "ahd-nama"],
    answer: "Purana Ahd-Nama (Old Testament) mein 39 kitabein hain jo Ibrani (Hebrew) aur Aramaic zaban mein likhi gayin. Isme dunya ki paidaish, Bani Israeel ki tareekh, aur anbiya ki paishgoiyan (prophecies) hain jo Aanay walay Masih ke baare mein batati hain."
  },
  {
    keywords: ["new testament", "naya", "naye", "injeel"],
    answer: "Naya Ahd-Nama (New Testament) mein 27 kitabein hain jo zyada tar Yunaani (Greek) zaban mein likhi gayin. Yeh Yesu Masih ki zindagi, mojzat, maut, ji uthne (resurrection), aur ibtadai kalisiya (early church) ki history par mabni hai."
  },
  {
    keywords: ["jesus", "yesu", "masih", "isa", "eesa", "christ"],
    answer: "Yesu Masih (Jesus Christ) Khuda ke betay (Son of God) aur dunya ke munji (Saviour) hain. Wo insani roop mein zameen par aaye, humare gunahon ke liye Saleeb par apni jaan qurban ki, aur teesre din murdon mein se ji uthein. Wo raah, haq aur zindagi hain (Yohanna 14:6)."
  },
  {
    keywords: ["god", "khuda", "allah", "yahweh", "rabb", "baap", "father"],
    answer: "Humara Khuda wahid, zinda, aur sacha Khuda hai jo Baap, Betay (Yesu Masih), aur Rooh-ul-Qudus (Holy Spirit) mein zahir hota hai (Trinity). Wo mohabbat hai aur usne is dunya ko paida kiya."
  },
  {
    keywords: ["rooh", "holy spirit", "qudus", "ruh"],
    answer: "Rooh-ul-Qudus (Holy Spirit) Taslees (Trinity) ka teesra shakhs hai. Yesu ke aasman par jane ke baad, Rooh-ul-Qudus imandaron mein basta hai taake unhe tasalli de, hidayat kare, aur Khuda ki marzi par chalne ki taqat de."
  },

  // Prophets & Key Bible Figures
  {
    keywords: ["moses", "moosa", "musa"],
    answer: "Moosa Nabi (Moses) ko Khuda ne chuna taake wo Bani Israeel ko Misr (Egypt) ki ghulami se azaad karwayen. Khuda ne unke zariye Darya-e-Qulzam (Red Sea) ko do hisso mein banta aur unhein Koh-e-Toor (Mount Sinai) par 10 ahkaam (Ten Commandments) diye."
  },
  {
    keywords: ["david", "dawood", "dawud"],
    answer: "Dawood (David) Israeel ke doosre aur sabse azeem badshah the. Wo ek gadariya (shepherd) the jinhone Khuda par iman rakh kar azeem pehalwan Joliath (Goliath) ko haraya. Unhone Zaboor (Psalms) ki bohot si kitabein likhin. Yesu Masih unhi ki nasal se paida hue."
  },
  {
    keywords: ["abraham", "ibrahim"],
    answer: "Ibrahim (Abraham) ko imandaron ka baap (Father of Faith) kaha jata hai. Khuda ne unse wada kiya tha ke unki nasal se azeem qomein paida hongi. Unka imaan itna mazboot tha ke wo apne betay Ishaq ko qurban karne ke liye bhi tayyar the jab Khuda ne unhe azmaya."
  },
  {
    keywords: ["paul", "paulus", "khat", "khatoot"],
    answer: "Paulus Rasool (Apostle Paul) pehle masihiyon par zulm karte the, lekin Yesu Masih ke darshan ke baad wo ibtadai kalisiya ke sabse bade mubashir (evangelist) ban gaye. Unhone Naye Ahd-Name (New Testament) ki zyada tar kitabein (khatoot / epistles) likhin."
  },
  {
    keywords: ["genesis", "paidaish"],
    answer: "Paidaish (Genesis) Bible ki pehli kitab hai jo Moosa ne likhi. Isme duniya ki takhleeq (creation), Adam aur Hawa, Nooh ka toofan, aur Ibrahim, Ishaq, Yakoob, aur Yousuf ki kahani shamil hai."
  },
  {
    keywords: ["revelation", "mukashfa"],
    answer: "Mukashfa (Revelation) Bible ki aakhri kitab hai jo Yohanna Rasool (Apostle John) ne likhi. Isme aakhri zamane ki nishaniyan, Yesu Masih ki dusri aamad (Second Coming), aur naye aasman aur nayi zameen ka zikr hai."
  },
  {
    keywords: ["sin", "gunah", "salvation", "najat", "bakhshish", "maafi"],
    answer: "Bible batati hai ke sabne gunah kiya hai aur Khuda ke jalal se mehroom hain. Lekin najat (Salvation) Khuda ka muft inaam hai jo sirf Yesu Masih par iman lane se milti hai, kyunki unhone humare gunahon ki qeemat chuka di hai."
  },
];

const QUICK_REPLIES = [
  "BTL TV kya hai?",
  "BTL Shows",
  "Urdu Audio Bible",
  "Bible History",
  "Yesu Masih",
  "Live Support",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Khush Amdeed! Main BTL TV ka Assistant hoon. Aap mujhse BTL TV, humare Shows, Audio Bible, ya Bible aur Christian History ke baare mein kuch bhi pooch sakte hain!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate thinking delay
    setTimeout(() => {
      generateResponse(text);
    }, 500);
  };

  const generateResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    let botReply = "";

    // Greetings
    if (lowerText.match(/^(hi|hello|salam|assalam|hey|hy|helloo)/)) {
      botReply = "Salam! Main aapki kya madad kar sakta hoon? Aap mujhse Bible ki tareekh ya BTL TV ke programs ke bare mein pooch sakte hain.";
    } 
    // Thanks
    else if (lowerText.includes("thanks") || lowerText.includes("shukriya") || lowerText.includes("thank you")) {
      botReply = "Khuda aapko barkat de! (God bless you!) Aur koi sawal ho toh zaroor poochein.";
    }
    // Main Knowledge Base Search Engine
    else {
      let foundMatch = false;
      // Find the first matching knowledge base entry
      for (const entry of KNOWLEDGE_BASE) {
        if (entry.keywords.some((kw) => lowerText.includes(kw))) {
          botReply = entry.answer;
          foundMatch = true;
          break; // Stop at first match to avoid multiple overlapping answers
        }
      }

      // If absolutely no match found
      if (!foundMatch) {
        botReply = "Acha sawal hai! Lekin meri memory mein is waqt iska jawab nahi hai. Main Bible, Anbiya (Prophets), BTL TV ke Shows, aur Live TV ke baare mein bohot kuch janta hoon. Aap 'Moosa', 'Dawood', 'Naya Ahd-nama' ya 'BTL Shows' type karke dekhein. Agar aap kisi insaan se baat karna chahte hain toh 'Live Support' likhein.";
      }
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "bot", text: botReply, isHtml: botReply.includes("<") },
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[9999] h-16 w-16 rounded-full bg-black border-2 border-btl-red text-white shadow-xl shadow-btl-red/40 flex items-center justify-center transition-transform ${isOpen ? 'hidden' : 'flex'} overflow-hidden p-2`}
      >
        <img src="/images/logo/btl-logo.webp" alt="Chat" className="w-full h-full object-contain" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 sm:bottom-24 sm:right-6 z-[9999] w-[calc(100vw-3rem)] sm:w-[380px] h-[500px] max-h-[80vh] bg-[#0f0f11] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-btl-red-dark to-btl-red p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-black p-1.5 rounded-full border border-white/20 h-10 w-10 flex items-center justify-center overflow-hidden shrink-0">
                  <img src="/images/logo/btl-logo.webp" alt="BTL Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">BTL TV Assistant</h3>
                  <p className="text-white/70 text-xs">Aapki Khidmat Mein</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center overflow-hidden ${msg.sender === "user" ? "bg-white/10" : "bg-black border border-white/10 p-1"}`}>
                    {msg.sender === "user" ? <User className="h-4 w-4 text-white" /> : <img src="/images/logo/btl-logo.webp" alt="BTL Logo" className="w-full h-full object-contain" />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-white/10 text-white rounded-tr-none"
                        : "bg-btl-red/10 border border-btl-red/20 text-gray-200 rounded-tl-none"
                    }`}
                  >
                    {msg.isHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
              {QUICK_REPLIES.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(reply)}
                  className="px-3 py-1.5 text-xs bg-white/5 hover:bg-btl-red/20 hover:text-btl-red border border-white/10 rounded-full text-gray-300 transition-colors shrink-0"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-black/40 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Sawal puchiye..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-btl-red transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="h-10 w-10 shrink-0 bg-btl-red text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-btl-red-dark transition-colors"
                >
                  <Send className="h-4 w-4 ml-[-2px]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
