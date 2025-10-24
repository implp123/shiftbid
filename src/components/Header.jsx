// src/components/Header.jsx
import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-[#1a0000] via-[#2a0a0a] to-[#1a0000] text-amber-50 shadow-[0_2px_15px_rgba(0,0,0,0.5)] border-b border-amber-700/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Title */}
        <h1 className="text-3xl font-bold tracking-wide flex items-center gap-2 text-amber-400 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
          🔥 ShiftBid Draft Board
        </h1>

        {/* Right: Motto */}
        <span className="hidden md:block text-sm md:text-base italic text-amber-300 opacity-90 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          “Brother against brother — pick wisely.”
        </span>
      </div>

      {/* Ember accent line */}
      <div className="h-[3px] bg-gradient-to-r from-amber-500 via-red-600 to-amber-500 shadow-[0_0_12px_rgba(255,80,0,0.6)]" />
    </header>
  );
}
