// src/components/TrainingDivision.jsx
import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

export default function TrainingDivision({
  td,
  onDrop,
  onDragEnter,
  onDragLeave,
  allowDrop,
  dragOver,
}) {
  const boxRef = useRef(null);
  const [lastCount, setLastCount] = useState(td.length);

  // 🎉 Trigger confetti burst when a new member is added
  useEffect(() => {
    if (td.length > lastCount && boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();

      // Calculate approximate origin relative to viewport
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      // Localized confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        startVelocity: 35,
        gravity: 0.8,
        zIndex: 9999,
      });
    }
    setLastCount(td.length);
  }, [td, lastCount]);

  return (
    <div
      ref={boxRef}
      onDragOver={allowDrop}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={`relative flex flex-col items-center justify-start min-w-[260px] w-64 p-4 rounded-2xl border-2 border-amber-700
        bg-gradient-to-b from-[#4a1d1d] to-[#2a0a0a] text-amber-100
        shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-200 ${
          dragOver
            ? "scale-105 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)]"
            : ""
        }`}
    >
      {/* 🏆 Header */}
      <h2 className="flex items-center gap-2 font-bold text-lg text-amber-300 mb-3 tracking-wide">
        <span role="img" aria-label="trophy">
          🏆
        </span>
        Training Division
      </h2>

      {/* Drop area */}
      {td.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-[220px] w-full rounded-lg border border-dashed border-amber-700/40 bg-[rgba(255,255,255,0.05)]">
          <p className="text-sm text-amber-400/70 italic">Drop members here</p>
        </div>
      ) : (
        <ul className="space-y-1 text-sm text-center max-h-[220px] overflow-auto pr-1 w-full">
          {td.map((person) => (
            <li
              key={person.id}
              className="px-2 py-1 rounded-md bg-[rgba(255,255,255,0.08)] border border-amber-800/40"
            >
              {person.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
