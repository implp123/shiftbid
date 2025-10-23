import React from "react";
import { BADGE, SPECIALTIES } from "../lib/roster.js";

export default function FirefighterCard({
  person,
  note,
  singleChoice,
  onDragStart,
  onDragEnd,
}) {
  return (
    <div
      draggable
      onDragStart={(ev) => onDragStart(ev, person.id)}
      onDragEnd={(ev) => {
        const drop = document.elementFromPoint(ev.clientX, ev.clientY);
        onDragEnd(person, drop);
      }}
      className={`p-3 mb-2 ring-1 ring-slate-200 rounded-xl bg-white/90 hover:bg-white transition cursor-grab hover:shadow-sm ${
        singleChoice ? "bg-amber-50" : ""
      }`}
    >
      <div className="font-medium">{person.name}</div>

      {note && <div className="mt-1 text-[13px] text-brand/90">{note}</div>}

      <div className="mt-1 flex flex-wrap gap-1">
        {SPECIALTIES.filter((s) => person.specialties[s.key]).map((s) => (
          <span
            key={s.key}
            className={`text-xs px-2 py-0.5 rounded-full ${BADGE[s.key]}`}
          >
            {s.title}
          </span>
        ))}
      </div>
    </div>
  );
}
