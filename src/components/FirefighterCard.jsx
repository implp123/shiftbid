// src/components/FirefighterCard.jsx
import React from "react";
import { SPECIALTIES, BADGE } from "../lib/roster.js";

export default function FirefighterCard({ person, note, singleChoice, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={(ev) => onDragStart(ev, person.id)}
      onDragEnd={(ev) => {
        const drop = document.elementFromPoint(ev.clientX, ev.clientY);
        onDragEnd(person, drop);
      }}
      className={`group relative p-3 mb-1 ring-1 ring-amber-900/50 rounded-xl 
      bg-[rgba(42,10,10,0.6)] hover:bg-[rgba(55,15,15,0.75)] 
      hover:shadow-[0_0_14px_rgba(251,191,36,0.6)] 
      backdrop-blur-md cursor-grab transition-transform duration-200 active:scale-[0.97] 
      ${singleChoice ? "border-l-4 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.6)]" : ""}`}
    >
      {/* Glow pulse overlay */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 animate-[emberFlicker_2.5s_infinite_ease-in-out] pointer-events-none" />

      {/* Name */}
      <div className="font-semibold text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide">
        {person.name}
      </div>

      {/* Specialties */}
      <div className="mt-1 flex flex-wrap gap-1">
        {SPECIALTIES.filter((s) => person.specialties[s.key]).map((s) => (
          <span
            key={s.key}
            className={`text-xs px-2 py-0.5 rounded-full ${BADGE[s.key]} border border-amber-900/30 shadow-[0_0_4px_rgba(0,0,0,0.3)]`}
          >
            {s.title}
          </span>
        ))}
      </div>

      {/* Restriction / Note */}
      {note && (
        <div className="mt-2 text-[12px] italic text-amber-300 bg-[rgba(255,255,255,0.05)] border-l-2 border-amber-500/60 px-2 py-1 rounded-r">
          {note}
        </div>
      )}
    </div>
  );
}

