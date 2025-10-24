// src/components/ShiftCard.jsx
import React, { useState, useEffect } from "react";
import { RULES, BADGE, SPECIALTIES, countsFor } from "../lib/roster.js";

export default function ShiftCard({
  k,
  shifts,
  onDropToShift,
  setDragOver,
  allowDrop,
  dragOver,
  onDragStart,
  onDragEnd,
}) {
  const c = countsFor(shifts[k]);
  const [glowClass, setGlowClass] = useState(null);

  // Determine glow color
  const glowFor = (person) => {
    if (!person) return "ring-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]";
    if (person.specialties.CaptainParamedic)
      return "ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)]";
    if (person.specialties.Captain || person.specialties.ActingCaptain)
      return "ring-red-500 shadow-[0_0_22px_rgba(239,68,68,0.7)]";
    if (person.specialties.Paramedic)
      return "ring-sky-400 shadow-[0_0_22px_rgba(56,189,248,0.65)]";
    if (person.specialties.HazMat)
      return "ring-purple-500 shadow-[0_0_22px_rgba(168,85,247,0.65)]";
    if (person.specialties.WaterRescue)
      return "ring-teal-400 shadow-[0_0_22px_rgba(45,212,191,0.65)]";
    if (person.specialties.Wildland)
      return "ring-lime-400 shadow-[0_0_22px_rgba(163,230,53,0.65)]";
    return "ring-amber-300 shadow-[0_0_22px_rgba(251,191,36,0.45)]";
  };

  // Handle drop visual
  const handleDrop = (ev) => {
    const id = parseInt(ev.dataTransfer.getData("text/plain"));
    const preCount = shifts[k].length;
    onDropToShift(ev, k);
    setTimeout(() => {
      const postCount = shifts[k].length;
      if (postCount > preCount) {
        const person = Object.values(shifts).flat().find((p) => p.id === id);
        setGlowClass(`ring-4 ${glowFor(person)} animate-drop-glow`);
      } else {
        setGlowClass("ring-4 ring-red-600 shadow-[0_0_25px_rgba(239,68,68,0.8)] animate-denied");
      }
    }, 100);
  };

  // Remove glow after animation
  useEffect(() => {
    if (!glowClass) return;
    const t = setTimeout(() => setGlowClass(null), 900);
    return () => clearTimeout(t);
  }, [glowClass]);

  return (
    <div
      onDragOver={allowDrop}
      onDrop={handleDrop}
      onDragEnter={() => setDragOver(k)}
      onDragLeave={() => setDragOver(null)}
      className={`shift-card relative rounded-2xl transition-all duration-500 p-4 ring-1 overflow-hidden ${
        dragOver
          ? "ring-amber-400 shadow-[0_0_28px_rgba(251,191,36,0.6)] scale-[1.02]"
          : glowClass
          ? glowClass
          : "ring-amber-900/40"
      } bg-[rgba(42,10,10,0.6)] backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_18px_rgba(251,191,36,0.4)]`}
    >
      {/* Flicker Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent opacity-0 hover:opacity-100 animate-[emberFlicker_2.8s_infinite_ease-in-out] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <h2 className="font-semibold text-amber-400 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] ember-flicker">
          Shift {k}
        </h2>
        <span className="text-xs text-amber-300">{shifts[k].length} members</span>
      </div>

      {/* Specialty counts */}
      <div className="grid grid-cols-2 gap-x-2 text-[13px] mb-3 text-amber-200 relative z-10">
        {[
          ["BattalionChief", "BC", c.BattalionChief, "=1"],
          ["Captain", "Capt.", c.Captain, `≤5 (incl. Capt-Medics)`],
          ["CaptainParamedic", "Capt-Medic", c.CaptainParamedic, `≥${RULES.captainParamedicMin}`],
          ["ActingCaptain", "Act. Capt.", c.ActingCaptain, `≥${RULES.actingCaptainMin}`],
          ["ActingBattalion", "Act. Batt.", c.ActingBattalion, "=1"],
          ["Paramedic", "Medic", c.Paramedic, `≥${RULES.paramedicMin}`],
          ["HazMat", "HazMat", c.HazMat, `${RULES.hazmatMin}–${RULES.hazmatMax}`],
          ["WaterRescue", "Water Res.", c.WaterRescue, `${RULES.waterMin}–${RULES.waterMax}`],
          ["Wildland", "Wildland", c.Wildland, `${RULES.wildlandMin}–${RULES.wildlandMax}`],
        ].map(([key, label, val, req]) => (
          <div key={label} className="flex justify-between items-center">
            <span className={`text-xs px-2 py-0.5 rounded-full ${BADGE[key]} border border-amber-900/30`}>
              {label}
            </span>
            <span className="tabular-nums">{val}/{req}</span>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="min-h-[220px] overflow-auto pr-1 relative z-10">
        {shifts[k].map((p) => (
          <div
            key={p.id}
            draggable
            onDragStart={(ev) => onDragStart(ev, p.id)}
            onDragEnd={(ev) => {
              const drop = document.elementFromPoint(ev.clientX, ev.clientY);
              onDragEnd(p, drop);
            }}
            className="p-3 mb-1 ring-1 ring-amber-900/40 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] cursor-grab transition-transform duration-150 active:scale-[0.98]"
          >
            <div className="font-medium text-amber-200">{p.name}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {SPECIALTIES.filter((s) => p.specialties[s.key]).map((s) => (
                <span
                  key={s.key}
                  className={`text-xs px-2 py-0.5 rounded-full ${BADGE[s.key]} border border-amber-900/30`}
                >
                  {s.title}
                </span>
              ))}
            </div>
          </div>
        ))}
        {shifts[k].length === 0 && (
          <div className="text-sm text-slate-400 italic">Drag a firefighter here…</div>
        )}
      </div>
    </div>
  );
}
