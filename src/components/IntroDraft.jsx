import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

export default function IntroDraft() {
  const [phase, setPhase] = useState("ready"); // 'ready' | 'animating' | 'done'
  const [bgPulse, setBgPulse] = useState(false);

  // background pulse during animation
  useEffect(() => {
    if (phase !== "animating") return;
    const interval = setInterval(() => setBgPulse((p) => !p), 700);
    setTimeout(() => clearInterval(interval), 6500);
    return () => clearInterval(interval);
  }, [phase]);

  // handle automatic fade-out
  useEffect(() => {
    if (phase === "animating") {
      const timer = setTimeout(() => setPhase("done"), 7500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const startAnimation = () => {
    setPhase("animating");
    const audio = new Audio("/draft_intro.wav");
    audio.volume = 1;
    setTimeout(() => audio.play().catch(() => {}), 100);
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${
            phase === "animating"
              ? bgPulse
                ? "bg-red-950"
                : "bg-black"
              : "bg-black"
          } text-white overflow-hidden`}
        >
          {/* 🔥 READY STATE — Start button */}
          {phase === "ready" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center text-center"
            >
              <Flame
                size={120}
                onClick={startAnimation}
                className="text-red-600 cursor-pointer animate-pulse drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] hover:scale-110 transition-transform duration-200"
              />
              <p className="mt-4 text-lg tracking-widest text-slate-300 uppercase">
                Enter the Draft
              </p>
              <p className="text-xs text-slate-500 italic mt-1">
                Brother against brother awaits...
              </p>
            </motion.div>
          )}

          {/* 🔥 ANIMATING STATE — cinematic intro */}
          {phase === "animating" && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,80,80,0.1),rgba(0,0,0,0.9))] animate-pulse" />
              <div className="absolute inset-0 bg-[url('/embers.gif')] bg-cover bg-center opacity-20 pointer-events-none" />

              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <Flame
                  size={100}
                  className="text-red-600 animate-pulse mb-4 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]"
                />

                <motion.p
                  className="text-lg sm:text-2xl font-semibold italic text-red-200 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  Brother against brother.
                </motion.p>

                <motion.p
                  className="text-lg sm:text-2xl font-semibold italic text-red-300 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 1 }}
                >
                  Shift picks don’t care about your feelings.
                </motion.p>

                <motion.h1
                  className="text-3xl sm:text-5xl mt-4 font-bold tracking-wider uppercase text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.7)]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.5, duration: 1.5 }}
                >
                  Welcome to the Shift Draft
                </motion.h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.8, duration: 1 }}
                className="mt-8 text-slate-300 text-sm italic relative z-10"
              >
                "No Crying...Dan..."
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
