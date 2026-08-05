"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const messages = [
  "Initializing VoltOps Neural Core",
  "Verifying encrypted workshop session",
  "Syncing EV diagnostic telemetry",
  "Loading repair intelligence models",
  "Finalizing dashboard interface",
];

export default function AppLoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < messages.length - 1 ? prev + 1 : prev
      );
    }, 2800);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev;
        return prev + Math.floor(Math.random() * 5 + 1);
      });
    }, 600);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-[#FFFFFF]">
      
      {/* Ultra-Subtle Radial Mesh for depth without darkness */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(248, 250, 252, 1) 0%, rgba(255, 255, 255, 1) 100%)"
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-8">
        
        {/* Logo & Ring Assembly */}
        <div className="relative flex h-36 w-36 items-center justify-center">
          
          {/* Outer Ring: Very subtle gray with a sharp primary blue leading edge */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border border-slate-100 border-t-blue-600"
          />

          {/* Inner Ring: Counter-rotating, softer accent */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: "linear",
            }}
            className="absolute inset-3 rounded-full border border-slate-50 border-b-sky-400"
          />

          {/* Core Logo Container: Pure white with a high-end diffuse drop shadow */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-100"
          >
            <Image
              src="/icons/icon-192.png" 
              width={42}
              height={42}
              alt="VoltOps"
              priority
              className="opacity-90"
            />
          </motion.div>
        </div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 text-xl font-light tracking-[0.4em] text-slate-400"
        >
          VOLT<span className="font-semibold text-slate-900">OPS</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-2 text-center text-[11px] font-semibold tracking-widest text-blue-600 uppercase"
        >
          AI-Native EV Intelligence
        </motion.p>

        {/* Dynamic Message Matrix */}
        <div className="mt-16 h-6 w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(4px)", y: -5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center text-[13px] font-medium tracking-wide text-slate-500"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Minimalist Progress Bar */}
        <div className="mt-8 w-full max-w-60">
          <div className="mb-3 flex justify-between items-end text-[10px] tracking-wider text-slate-400">
            <span className="uppercase font-medium">System Status</span>
            <span className="font-mono font-semibold text-slate-800">{progress}%</span>
          </div>

          <div className="h-0.75 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="relative h-full w-full rounded-full bg-blue-600"
            />
          </div>
        </div>

        {/* Footer */}
        <motion.p
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 text-center text-[10px] tracking-widest text-slate-400 uppercase font-medium"
        >
          End-to-End Encrypted
        </motion.p>

      </div>
    </div>
  );
}