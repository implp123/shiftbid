import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🔥 Random positive and congratulatory remarks
const commentatorLines = [
  [
    (name, shift) => `🔥 ${shift} just drafted ${name}! What a move.`,
    (name) => `Absolutely — ${name} is a total morale boost!`,
  ],
  [
    (name, shift) => `🚒 Big pickup for ${shift}: ${name}!`,
    (name) => `No doubt — ${name}'s going to set that crew on fire (in a good way)!`,
  ],
  [
    (name, shift) => `You can feel it — ${name} to ${shift} changes everything.`,
    (name) => `Exactly, that’s the kind of leadership every shift dreams of.`,
  ],
  [
    (name, shift) => `🔥 ${shift} just scored ${name}. Outstanding pick!`,
    (name) => `Couldn’t agree more — ${name} brings serious heat.`,
  ],
  [
    (name, shift) => `${name} to ${shift}! The crowd goes wild!`,
    (name) => `That’s the kind of chemistry that wins seasons.`,
  ],
  [
    (name, shift) => `${shift} just got way stronger with ${name}.`,
    (name) => `Yeah — that’s a veteran presence if I’ve ever seen one.`,
  ],
  [
    (name, shift) => `And there it is! ${name} joining ${shift}!`,
    (name, shift) => `🔥 Unreal — ${shift} just became a powerhouse.`,
  ],
];

export default function Commentators({ latestPlacement }) {
  const [dialogue, setDialogue] = useState(null);
  const [imageSrc, setImageSrc] = useState("/commentators.png");

  useEffect(() => {
    if (!latestPlacement) return;

    // Change to cheer image when placement happens
    setImageSrc("/cheer.png");

    const [leftLine, rightLine] =
      commentatorLines[Math.floor(Math.random() * commentatorLines.length)];
    const { name, shift } = latestPlacement;

    setDialogue({
      left: leftLine(name, shift),
      right: rightLine(name, shift),
    });

    const timer = setTimeout(() => {
      setDialogue(null);
      setImageSrc("/commentators.png"); // Revert to commentators after dialogue
    }, 2000);

    return () => clearTimeout(timer);
  }, [latestPlacement]);

  return (
    <div className="relative flex flex-col items-center min-w-[260px]">
      <img
        src={imageSrc}
        alt="Commentators or Cheer"
        className="w-64 select-none pointer-events-none"
      />

      <AnimatePresence mode="popLayout">
        {dialogue && (
          <div key="speech-group" className="relative w-full">
            {/* Left bubble */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: -40 }}
              animate={{ opacity: 1, x: -10, y: -250 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.4 }}
              className="absolute left-0 top-0 max-w-[200px] p-3 text-sm font-semibold text-amber-100 bg-gradient-to-b from-[#4a1d1d] to-[#2a0a0a] border border-amber-700 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] leading-tight"
            >
              <p>{dialogue.left}</p>
            </motion.div>

            {/* Right bubble */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: -50 }}
              animate={{ opacity: 1, x: -70, y: -130 }}
              exit={{ opacity: 0, y: -70 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="absolute right-0 top-0 max-w-[200px] p-3 text-sm font-semibold text-amber-100 bg-gradient-to-b from-[#4a1d1d] to-[#2a0a0a] border border-amber-700 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] leading-tight"
            >
              <p>{dialogue.right}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
