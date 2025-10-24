// src/components/TrainingDivision.jsx
import React from "react";

export default function TrainingDivision({
  td,
  onDrop,
  onDragEnter,
  onDragLeave,
  allowDrop,
  dragOver,
}) {
  return (
    <div
      onDragOver={allowDrop}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={`td-card transition-all duration-500 rounded-2xl ring-1 ring-amber-500/40 bg-[rgba(42,10,10,0.6)] backdrop-blur-md shadow-[0_0_25px_rgba(251,146,60,0.3)] p-4 flex-1 min-w-[260px] ${
        dragOver
          ? "ring-4 ring-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)] scale-[1.02]"
          : ""
      }`}
    >
      <h2 className="text-amber-400 font-semibold text-lg mb-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] ember-flicker">
        🏆 Training Division
      </h2>

      {td.length === 0 ? (
        <div className="italic text-sm text-slate-400">
          Drag one firefighter here for special assignment…
        </div>
      ) : (
        td.map((p) => (
          <div
            key={p.id}
            className="p-3 mt-2 rounded-xl bg-[rgba(255,255,255,0.08)] border border-amber-700/40 shadow-[0_0_12px_rgba(251,191,36,0.4)] transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="font-semibold text-amber-300">{p.name}</div>
            <div className="text-xs text-amber-200 mt-1 opacity-90">
              Assigned to Training Division
            </div>
          </div>
        ))
      )}
    </div>
  );
}
