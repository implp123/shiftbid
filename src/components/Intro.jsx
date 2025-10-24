// src/components/Intro.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

export default function Intro({ onFinish }) {
  const [phase, setPhase] = useState("ready"); // ready | animating | rules | flash | done
  const [rulesText, setRulesText] = useState("");
  const [showFlash, setShowFlash] = useState(false);

  const campfireAudio = useRef(null);
  const draftIntroAudio = useRef(null);
  const swordAudio = useRef(null);

  // --- preload all audio ---
  useEffect(() => {
    campfireAudio.current = new Audio("/campfire.mp3");
    draftIntroAudio.current = new Audio("/draft_intro.wav");
    swordAudio.current = new Audio("/sword.mp3");
    [campfireAudio, draftIntroAudio, swordAudio].forEach((ref) => {
      if (ref.current) ref.current.load();
    });

    return () => {
      // Cleanup any lingering audio when unmounted
      [campfireAudio, draftIntroAudio, swordAudio].forEach((ref) => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
  }, []);

  // --- load rules text ---
  useEffect(() => {
    fetch("/rules.txt")
      .then((r) => r.text())
      .then((t) => setRulesText(t))
      .catch(() => setRulesText("Unable to load rules."));
  }, []);

  // --- play campfire only during "ready" phase ---
  useEffect(() => {
    if (phase === "ready" && campfireAudio.current) {
      campfireAudio.current.loop = true;
      campfireAudio.current.volume = 0.25;
      campfireAudio.current.play().catch(() => {});
    } else if (campfireAudio.current) {
      campfireAudio.current.pause();
      campfireAudio.current.currentTime = 0;
    }
  }, [phase]);

  // --- auto transition from cinematic to rules ---
  useEffect(() => {
    if (phase === "animating") {
      const timer = setTimeout(() => setPhase("rules"), 6500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // --- Begin the Draft ---
  const startIntro = () => {
    // Stop campfire instantly
    if (campfireAudio.current) {
      campfireAudio.current.pause();
      campfireAudio.current.currentTime = 0;
    }

    // Play intro fire sound immediately
    if (draftIntroAudio.current) {
      draftIntroAudio.current.currentTime = 0;
      draftIntroAudio.current.volume = 0.9;
      draftIntroAudio.current.play().catch(() => {});
    }

    // Smooth transition to cinematic phase
    setPhase("animating");
  };

  // --- Choose Your Destiny ---
  const finishIntro = () => {
    if (swordAudio.current) {
      swordAudio.current.currentTime = 0;
      swordAudio.current.volume = 1;
      swordAudio.current.play().catch(() => {});
    }

    setShowFlash(true);
    setPhase("flash");

    setTimeout(() => {
      setShowFlash(false);
      setPhase("done");
      if (onFinish) onFinish();
    }, 600);
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#2a0a0a] to-[#0a0a0a] text-amber-100 overflow-hidden"
        >
          {/* --- PHASE 1: READY --- */}
          {phase === "ready" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center text-center"
            >
              <Flame
                size={120}
                onClick={startIntro}
                className="text-amber-400 cursor-pointer animate-pulse drop-shadow-[0_0_25px_rgba(255,180,0,0.8)] hover:scale-110 transition-transform duration-200"
              />
              <p className="mt-4 text-lg tracking-widest text-amber-300 uppercase">
                Begin the Draft
              </p>
              <p className="text-xs text-amber-400 italic mt-1">
                “Brother against brother awaits...”
              </p>
            </motion.div>
          )}

          {/* --- PHASE 2: CINEMATIC INTRO --- */}
          {phase === "animating" && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,80,80,0.15),rgba(0,0,0,0.95))]"
              />
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <Flame
                  size={100}
                  className="text-amber-400 animate-pulse mb-4 drop-shadow-[0_0_15px_rgba(255,180,0,0.9)]"
                />
                <motion.p
                  className="text-lg sm:text-2xl font-semibold italic text-amber-300 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                >
                  Brother against brother.
                </motion.p>
                <motion.p
                  className="text-lg sm:text-2xl font-semibold italic text-amber-200 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 1 }}
                >
                  Feelings will be hurt, but families will be forged.
                </motion.p>
                <motion.h1
                  className="text-3xl sm:text-5xl mt-4 font-bold tracking-wider uppercase text-amber-500 drop-shadow-[0_0_25px_rgba(255,180,0,0.8)]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3, duration: 1.2 }}
                >
                  Welcome to the Shift Bid 2025
                </motion.h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.4, duration: 1 }}
                className="mt-8 text-amber-400 text-sm italic relative z-10"
              >
                "No Crying...Dan..."
              </motion.div>
            </>
          )}

          {/* --- PHASE 3: RULES SCREEN --- */}
          {phase === "rules" && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-2xl p-6 bg-[rgba(42,10,10,0.6)] backdrop-blur-md border border-amber-800/50 rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.4)] text-center"
            >
              <h2 className="text-2xl font-bold text-amber-400 mb-3 drop-shadow-[0_0_8px_rgba(255,180,0,0.7)]">
                Draft Rules
              </h2>
              <div className="max-h-[50vh] overflow-auto text-left whitespace-pre-wrap text-amber-200 text-sm leading-relaxed p-2 border-t border-b border-amber-800/30">
                {rulesText}
              </div>
              <button
                onClick={finishIntro}
                className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-red-600 text-amber-100 font-semibold shadow-[0_0_20px_rgba(255,150,0,0.6)] hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                Choose Your Destiny
              </button>
            </motion.div>
          )}

          {/* --- PHASE 4: SWORD FLASH --- */}
          {showFlash && (
            <motion.div
              key="sword-flash"
              initial={{ x: "-100%", rotate: -10 }}
              animate={{ x: "100%", rotate: -10 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="fixed top-1/2 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_30px_rgba(255,200,0,0.9)]"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
