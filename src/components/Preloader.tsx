"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [show, setShow] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hasSeenPreloader = sessionStorage.getItem("btl-preloader-seen");
    if (hasSeenPreloader) return; // Skip preloader on repeat visits in same session
    
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("btl-preloader-seen", "true");
    }, 2800); 
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center overflow-hidden"
        >
          <div className="relative flex items-center justify-center w-full h-full">
            
            {/* Netflix-style Cinematic 'B' Zoom */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1, 1.05, 30], 
                opacity: [0, 1, 1, 0] 
              }}
              transition={{ 
                duration: 2.8, 
                times: [0, 0.2, 0.7, 1], 
                ease: "easeIn" 
              }}
              className="relative flex items-center justify-center origin-center"
            >
              <span 
                className="font-sans font-black text-[#E50914]"
                style={{ 
                  fontSize: "clamp(150px, 30vw, 250px)",
                  lineHeight: "1",
                  transform: "scaleY(1.3)", // Makes it tall and cinematic like Netflix font
                  display: "inline-block",
                  textShadow: "0 0 40px rgba(229,9,20,0.7)"
                }}
              >
                B
              </span>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
