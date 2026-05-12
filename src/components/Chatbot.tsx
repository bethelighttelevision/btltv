"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  isHtml?: boolean;
}

const BTL_INFO = {
  about: "BTL TV (Be The Light Television) ek Masihi (Christian) channel hai jo Urdu zaban mein Pakistan aur poori duniya ke liye broadcast karta hai. Humara maqsad Khuda ke kalaam ko phailana hai.",
  bible: "Aap humari website par Urdu Audio Bible sun sakte hain! Puraana aur Naya Ahd-nama dono maujood hain. Homepage par 'Urdu Bible' section check karein.",
  school: "BTL Bible School ek muft online platform hai jahan aap Bible ki bunyadi taleemat seekh sakte hain aur certificate hasil kar sakte hain. Menu se 'Bible School' par click karein.",
  live: "Aap humara 24/7 Live TV broadcast website ke 'Live TV' section mein dekh sakte hain.",
  donate: "Aapki madad humari ministry ke liye bohot ahmiyat rakhti hai. Donate karne ke liye website ke 'Donation' page par jayen.",
};

const BIBLE_HISTORY = {
  bible: "Bible (Khat-e-Muqaddas) 66 kitabon ka majmooa hai jise takreeban 40 mukhtalif logon ne 1500 saal ke arse mein Khuda ke rooh ki hidayat se likha.",
  oldTestament: "Purana Ahd-Nama (Old Testament) mein 39 kitabein hain jo Ibrani (Hebrew) zaban mein likhi gayin. Isme Khuda ki paidaish se lekar anbiya ke daur tak ka zikr hai.",
  newTestament: "Naya Ahd-Nama (New Testament) mein 27 kitabein hain jo zyada tar Yunaani (Greek) zaban mein likhi gayin. Yeh Yesu Masih ki zindagi, maut, aur ji uthne, aur ibtadai kalisiya ke baare mein hai.",
  jesus: "Yesu Masih (Jesus Christ) Khuda ke betay hain jo insani roop mein zameen par aaye taake humare gunahon ke liye apni jaan qurban karein aur teesre din murdon mein se ji uthein.",
  moses: "Moosa Nabi (Moses) ko Khuda ne chuna taake wo Bani Israeel ko misr (Egypt) ki ghulami se azaad karwayen. Khuda ne unhein 10 ahkaam (Ten Commandments) diye.",
  david: "Dawood (David) Israeel ke doosre badshah the. Wo ek gadariya (shepherd) the jinhone Joliath ko haraya. Unhone Zaboor (Psalms) ki bohot si kitabein likhin.",
};

const QUICK_REPLIES = [
  "BTL TV kya hai?",
  "Live Support / WhatsApp",
  "Bible History",
  "Bible School",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Khush Amdeed! Main BTL TV ka AI Assistant hoon. Main aapki kya madad kar sakta hoon?",
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
    }, 600);
  };

  const generateResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    let botReply = "";

    // Live Support / Human Help
    if (lowerText.includes("support") || lowerText.includes("human") || lowerText.includes("live") || lowerText.includes("contact") || lowerText.includes("whatsapp")) {
      botReply = "Agar aap humari support team ya pastors se baat karna chahte hain, toh kripya Contact page par jayen ya humein WhatsApp karein: <br/><br/><a href='/contact' class='text-btl-red underline font-bold'>Contact Page Par Jayen</a>";
    }
    // BTL TV Info
    else if (lowerText.includes("btl tv") || lowerText.includes("about")) {
      botReply = BTL_INFO.about;
    } else if (lowerText.includes("bible school") || lowerText.includes("course") || lowerText.includes("certificate")) {
      botReply = BTL_INFO.school;
    } else if (lowerText.includes("donate") || lowerText.includes("fund") || lowerText.includes("help")) {
      botReply = BTL_INFO.donate;
    }
    // Bible / History
    else if (lowerText.includes("bible history") || lowerText.includes("khat e muqaddas") || (lowerText.includes("history") && lowerText.includes("bible"))) {
      botReply = BIBLE_HISTORY.bible + "<br/><br/>Aap 'Old Testament' ya 'New Testament' ke baare mein pooch sakte hain.";
    } else if (lowerText.includes("old testament") || lowerText.includes("purana")) {
      botReply = BIBLE_HISTORY.oldTestament;
    } else if (lowerText.includes("new testament") || lowerText.includes("naya")) {
      botReply = BIBLE_HISTORY.newTestament;
    } else if (lowerText.includes("jesus") || lowerText.includes("yesu") || lowerText.includes("masih") || lowerText.includes("eesa")) {
      botReply = BIBLE_HISTORY.jesus;
    } else if (lowerText.includes("moses") || lowerText.includes("moosa")) {
      botReply = BIBLE_HISTORY.moses;
    } else if (lowerText.includes("david") || lowerText.includes("dawood")) {
      botReply = BIBLE_HISTORY.david;
    }
    // Fallback
    else {
      botReply = "Maaf kijiye, mujhe is topic ki zyada maloomat nahi hai. Main BTL TV aur Bible history ke baare mein bata sakta hoon. Agar aap kisi insaan se baat karna chahte hain toh 'Live Support' likhein.";
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
        className={`fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full bg-btl-red text-white shadow-xl shadow-btl-red/30 flex items-center justify-center transition-transform ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="h-6 w-6" />
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
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">BTL TV Assistant</h3>
                  <p className="text-white/70 text-xs">Aapki Khidmat Mein</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
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
                  <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === "user" ? "bg-white/10" : "bg-btl-red/20"}`}>
                    {msg.sender === "user" ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-btl-red" />}
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
