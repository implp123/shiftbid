// src/MainApp.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import {
  countsFor,
  parseSheetToRoster,
  poolMessageFor,
  getRemainingNeedsPerShift,
  minFor,
  SPECIALTIES,
} from "./lib/roster.js";
import Header from "./components/Header.jsx";
import TrainingDivision from "./components/TrainingDivision.jsx";
import ShiftCard from "./components/ShiftCard.jsx";
import FirefighterCard from "./components/FirefighterCard.jsx";

export default function MainApp() {
  const [pool, setPool] = useState([]);
  const [initPoolCounts, setInitPoolCounts] = useState(null);
  const [shifts, setShifts] = useState({ A: [], B: [], C: [] });
  const [td, setTD] = useState([]);
  const [dragOver, setDragOver] = useState(null);

  // Load Excel roster on startup
  useEffect(() => {
    import("xlsx").then((XLSX) => {
      fetch("/DRAFTBOARD (1).xlsx")
        .then((r) => r.arrayBuffer())
        .then((buf) => {
          const roster = parseSheetToRoster(XLSX.read(buf, { type: "array" }));
          setPool(roster);
          setInitPoolCounts(countsFor(roster));
        })
        .catch(() => {
          toast.error("Roster format not recognized — check column layout.");
          setPool([]);
        });
    });
  }, []);

  // Memoized helpers
  const allShiftMembers = useMemo(() => Object.values(shifts).flat(), [shifts]);
  const livePool = useMemo(() => countsFor(pool), [pool]);
  const poolCounts = useMemo(() => {
    const map = {};
    for (const s of SPECIALTIES) map[s.key] = 0;
    pool.forEach((p) => {
      for (const s of SPECIALTIES)
        if (p.specialties[s.key]) map[s.key]++;
    });
    return map;
  }, [pool]);

  // Assign firefighter to a shift
  const addToShift = useCallback((person, k) => {
    setPool((prev) => prev.filter((x) => x.id !== person.id));
    setTD((prev) => prev.filter((x) => x.id !== person.id));
    setShifts((prev) => {
      const n = { ...prev };
      for (const s in n) n[s] = n[s].filter((x) => x.id !== person.id);
      n[k] = [...n[k], person];
      return n;
    });
  }, []);

  // Add to training division
  const addToTD = useCallback(
    async (person) => {
      if (td.length >= 1) {
        toast.error("Training Division full.");
        return;
      }
      setPool((prev) => prev.filter((x) => x.id !== person.id));
      setShifts((prev) => {
        const next = { ...prev };
        for (const s in next) next[s] = next[s].filter((x) => x.id !== person.id);
        return next;
      });
      setTD([person]);
      // Play placement sound
const placeSound = new Audio("/kazoo.mp3");
placeSound.volume = 0.8;
placeSound.play().catch(() => {});

// Show success toast
toast.success(`${person.name} added to Shift ${k}`);

    },
    [td.length]
  );

  // Requirement logic
  const checkPlacement = useCallback(
    (person, k, shifts, pool) => {
      const newShifts = { ...shifts, [k]: [...shifts[k], person] };
      const capCount = newShifts[k].filter(
        (p) => p.specialties.Captain || p.specialties.CaptainParamedic
      ).length;
      if (
        (person.specialties.Captain || person.specialties.CaptainParamedic) &&
        capCount > 5
      )
        return "Shift already has 5 Captains (including Capt-Medics).";

      const capMedicCounts = ["A", "B", "C"].map(
        (s) => newShifts[s].filter((p) => p.specialties.CaptainParamedic).length
      );
      const poolCapMedics = poolCounts.CaptainParamedic;
      const remainingNeed = capMedicCounts.reduce(
        (t, n) => t + Math.max(2 - n, 0),
        0
      );
      if (poolCapMedics < remainingNeed)
        return "Not enough Captain-Medics to meet the 2-per-shift minimum.";

      for (const spec of SPECIALTIES) {
        const key = spec.key;
        const min = minFor(key);
        if (min === 0 || key.startsWith("Captain")) continue;
        const needs = getRemainingNeedsPerShift(newShifts, key);
        const totalNeed = needs.A + needs.B + needs.C;
        if (poolCounts[key] < totalNeed)
          return `Placing ${person.name} in Shift ${k} would make it impossible to meet minimum ${spec.title} requirements across all shifts.`;
      }
      return null;
    },
    [poolCounts]
  );

  // Drag/drop handlers
  const onDragStart = useCallback((ev, id) => {
    ev.dataTransfer.setData("text/plain", id);
    ev.dataTransfer.effectAllowed = "move";
  }, []);

  const allowDrop = useCallback((ev) => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }, []);

  const onDropToShift = useCallback(
    (ev, k) => {
      ev.preventDefault();
      setDragOver(null);
      const id = parseInt(ev.dataTransfer.getData("text/plain"));
      const person =
        pool.find((p) => p.id === id) ||
        td.find((p) => p.id === id) ||
        allShiftMembers.find((p) => p.id === id);
      if (!person) return;
      const error = checkPlacement(person, k, shifts, pool);
      if (error) {
        toast.error(error);
        return;
      }
      addToShift(person, k);
			// Play placement sound
const placeSound = new Audio("/shift_place.m4a");
placeSound.volume = 0.8;
placeSound.play().catch(() => {});

// Show success toast
toast.success(`${person.name} added to Shift ${k}`);

      
    },
    [allShiftMembers, pool, td, shifts, addToShift, checkPlacement]
  );

  const onDropToTD = useCallback(
    (ev) => {
      ev.preventDefault();
      setDragOver(null);
      const id = parseInt(ev.dataTransfer.getData("text/plain"));
      const person =
        pool.find((p) => p.id === id) ||
        allShiftMembers.find((p) => p.id === id) ||
        td.find((p) => p.id === id);
      if (!person) return;
      addToTD(person);
    },
    [pool, td, allShiftMembers, addToTD]
  );

  const onDragEndToPool = useCallback(
    (person, droppedOnEl) => {
      const fromTD = td.some((p) => p.id === person.id);
      if (fromTD) return;
      if (
        !droppedOnEl ||
        (!droppedOnEl.closest?.(".shift-card") &&
          !droppedOnEl.closest?.(".td-card"))
      ) {
        setShifts((prev) => {
          const n = { ...prev };
          for (const k in n) n[k] = n[k].filter((x) => x.id !== person.id);
          return n;
        });
        setPool((prev) =>
          prev.some((x) => x.id === person.id)
            ? prev
            : [...prev, person].sort((a, b) => a.id - b.id)
        );
      }
    },
    [td]
  );

  // Export to Excel
  const exportToExcel = useCallback(() => {
    const wb = XLSX.utils.book_new();
    const mk = (title, list) => {
      const rows = [["Name", ...SPECIALTIES.map((s) => s.title)]];
      list.forEach((p) => {
        const row = [p.name];
        SPECIALTIES.forEach((s) => row.push(p.specialties[s.key] ? "✔️" : ""));
        rows.push(row);
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), title);
    };
    mk("Shift A", shifts.A);
    mk("Shift B", shifts.B);
    mk("Shift C", shifts.C);
    mk("Training Division", td);
    mk("Pool", pool);
    XLSX.writeFile(wb, "ShiftBidResults.xlsx");
    toast.success("Exported to ShiftBidResults.xlsx");
  }, [shifts, td, pool]);

  // --- UI ---
  return (
    <div className="min-h-screen text-amber-100 bg-gradient-to-b from-[#0a0a0a] via-[#2a0a0a] to-[#0a0a0a]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-5">
        {/* Counters */}
        <div className="glass rounded-2xl p-3 md:p-4 flex flex-wrap gap-2 items-center text-sm justify-center ring-1 ring-amber-800/50 bg-[rgba(42,10,10,0.6)] backdrop-blur-md">
          {SPECIALTIES.map((s) => {
            const start = initPoolCounts ? initPoolCounts[s.key] : 0;
            const remain = livePool[s.key] || 0;
            return (
              <span
                key={s.key}
                className="px-3 py-1 rounded-full ring-1 ring-amber-600 bg-[rgba(255,255,255,0.06)] text-amber-300"
              >
                {s.title}: {start} → {remain} remaining
              </span>
            );
          })}
        </div>

        {/* Controls */}
        <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-amber-900 bg-goldAmber hover:bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)] active:scale-95 transition"
            >
              Print Summary
            </button>
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-amber-900 bg-amber-300 hover:bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)] active:scale-95 transition"
            >
              Export to Excel
            </button>
          </div>

          <TrainingDivision
            td={td}
            onDrop={onDropToTD}
            onDragEnter={() => setDragOver("TD")}
            onDragLeave={() => setDragOver(null)}
            allowDrop={allowDrop}
            dragOver={dragOver === "TD"}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-1">
          {/* Pool */}
          <div
            onDragOver={allowDrop}
            onDrop={(ev) => ev.preventDefault()}
            className="glass rounded-2xl p-4 md:p-5 overflow-hidden bg-[rgba(42,10,10,0.6)] ring-1 ring-amber-900/40 backdrop-blur-md"
          >
            <h2 className="font-semibold text-amber-300 mb-3 flex items-center justify-center ember-flicker">
              Available Firefighters
            </h2>
            <div className="overflow-auto max-h-[65vh] pr-1 will-change-transform">
              {pool.map((p) => {
                const noteObj = poolMessageFor(p, pool, shifts);
                const singleChoice = noteObj?.shifts?.length === 1;
                return (
                  <FirefighterCard
                    key={p.id}
                    person={p}
                    note={noteObj?.text}
                    singleChoice={singleChoice}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEndToPool}
                  />
                );
              })}
            </div>
          </div>

          {/* Shift Columns */}
          {["A", "B", "C"].map((k) => (
            <ShiftCard
              key={k}
              k={k}
              shifts={shifts}
              setShifts={setShifts}
              onDropToShift={onDropToShift}
              setDragOver={setDragOver}
              allowDrop={allowDrop}
              dragOver={dragOver === k}
              onDragStart={onDragStart}
              onDragEnd={onDragEndToPool}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
