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
  const [glowColor, setGlowColor] = useState(null);

  // Determine glow color based on dropped person's specialties
  const getGlowColor = (person) => {
    if (person.specialties.CaptainParamedic) return "ring-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.6)]";
    if (person.specialties.Captain || person.specialties.ActingCaptain)
      return "ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]";
    if (person.specialties.Paramedic) return "ring-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.6)]";
    if (person.specialties.HazMat) return "ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]";
    if (person.specialties.WaterRescue) return "ring-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.6)]";
    if (person.specialties.Wildland) return "ring-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.6)]";
    return "ring-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.4)]";
  };

  const handleDrop = (ev) => {
    const id = parseInt(ev.dataTransfer.getData("text/plain"));
    const preCount = shifts[k].length;
    onDropToShift(ev, k);

    // Wait briefly, then detect success and set color
    setTimeout(() => {
      const newCount = shifts[k].length;
      if (newCount > preCount) {
        const person = Object.values(shifts)
          .flat()
          .find((p) => p.id === id);
        if (person) setGlowColor(getGlowColor(person));
      } else {
        setGlowColor("ring-red-600 shadow-[0_0_20px_rgba(239,68,68,0.8)]");
      }
    }, 100);
  };

  // Remove glow after 1 second
  useEffect(() => {
    if (glowColor) {
      const t = setTimeout(() => setGlowColor(null), 1000);
      return () => clearTimeout(t);
    }
  }, [glowColor]);

  return (
    <div
      onDragOver={allowDrop}
      onDrop={handleDrop}
      onDragEnter={() => setDragOver(k)}
      onDragLeave={() => setDragOver(null)}
      className={`shift-card glass rounded-2xl p-4 md:p-5 overflow-hidden transition-all duration-500 ${
        dragOver
          ? "ring-4 ring-amber-400"
          : glowColor
          ? `ring-4 ${glowColor}`
          : "ring-1 ring-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-slate-800">Shift {k}</h2>
        <span className="text-xs text-slate-600">{shifts[k].length} members</span>
      </div>

      {/* Specialty counts */}
      <div className="grid grid-cols-2 text-[13px] mb-3 gap-x-2">
        {[
          ["BattalionChief", "BC", c.BattalionChief, "=1"],
          ["Captain", "Capt.", c.Captain, `≥${RULES.captainMin}`],
          ["CaptainParamedic", "Capt-Medic", c.CaptainParamedic, `≥${RULES.captainParamedicMin}`],
          ["ActingCaptain", "Act. Capt.", c.ActingCaptain, `≥${RULES.actingCaptainMin}`],
          ["ActingBattalion", "Act. Batt.", c.ActingBattalion, "=1"],
          ["Paramedic", "Medic", c.Paramedic, `≥${RULES.paramedicMin}`],
          ["HazMat", "HazMat", c.HazMat, `${RULES.hazmatMin}–${RULES.hazmatMax}`],
          ["WaterRescue", "Water Res.", c.WaterRescue, `${RULES.waterMin}–${RULES.waterMax}`],
          ["Wildland", "Wildland", c.Wildland, `${RULES.wildlandMin}–${RULES.wildlandMax}`],
        ].map(([key, label, val, req]) => (
          <div key={label} className="flex justify-between items-center">
            <span className={`text-xs px-2 py-0.5 rounded-full ${BADGE[key]}`}>{label}</span>
            <span>{val}/{req}</span>
          </div>
        ))}
      </div>

      {/* Member list */}
      <div className="min-h-[220px] overflow-auto pr-1">
        {shifts[k].map((p) => (
          <div
            key={p.id}
            draggable
            onDragStart={(ev) => onDragStart(ev, p.id)}
            onDragEnd={(ev) => {
              const drop = document.elementFromPoint(ev.clientX, ev.clientY);
              onDragEnd(p, drop);
            }}
            className="p-3 mb-1 ring-1 ring-slate-200 rounded-xl bg-white/90 hover:bg-white cursor-grab"
          >
            <div className="font-medium">{p.name}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {SPECIALTIES.filter((s) => p.specialties[s.key]).map((s) => (
                <span
                  key={s.key}
                  className={`text-xs px-2 py-0.5 rounded-full ${BADGE[s.key]}`}
                >
                  {s.title}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
