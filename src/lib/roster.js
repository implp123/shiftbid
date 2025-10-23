import * as XLSX from "xlsx";

export const SPECIALTIES = [
  { key: "BattalionChief", title: "BC" },
  { key: "Captain", title: "Capt." },
  { key: "CaptainParamedic", title: "Capt-Medic" },
  { key: "ActingCaptain", title: "Act. Capt." },
  { key: "ActingBattalion", title: "Act. Batt." },
  { key: "Paramedic", title: "Medic" },
  { key: "IVTech", title: "IV Tech" },
  { key: "HazMat", title: "HazMat" },
  { key: "WaterRescue", title: "Water Res." },
  { key: "Wildland", title: "Wildland" },
];

export const BADGE = {
  BattalionChief: "bg-red-50 text-red-700 ring-1 ring-red-200",
  Captain: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  CaptainParamedic: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  ActingCaptain: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  ActingBattalion: "bg-pink-50 text-pink-700 ring-1 ring-pink-200",
  Paramedic: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  IVTech: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  HazMat: "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
  WaterRescue: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200",
  Wildland: "bg-lime-50 text-lime-700 ring-1 ring-lime-200",
};

export const RULES = {
  bcMax: 1,
  captainMin: 5,
  captainParamedicMin: 2,
  actingCaptainMin: 3,
  actingBattalionMin: 1,
  actingBattalionMax: 1,
  paramedicMin: 7,
  hazmatMin: 5,
  hazmatMax: 8,
  waterMin: 5,
  waterMax: 8,
  wildlandMin: 5,
  wildlandMax: 8,
};

export function parseSheetToRoster(wb) {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }).slice(1);
  return rows
    .map((r, i) => {
      const name = r[0];
      if (!name) return null;
      return {
        id: i + 1,
        name,
        specialties: {
          BattalionChief: !!r[2],
          Captain: !!r[3] && !r[5],
          CaptainParamedic: !!r[3] && !!r[5],
          HazMat: !!r[4],
          Paramedic: !!r[5] && !r[3],
          WaterRescue: !!r[6],
          Wildland: !!r[7],
          IVTech: !!r[8],
          ActingCaptain: !!r[9],
          ActingBattalion: !!r[10],
        },
      };
    })
    .filter(Boolean);
}

export function countsFor(list) {
  const c = {};
  SPECIALTIES.forEach((s) => (c[s.key] = 0));

  list.forEach((p) => {
    SPECIALTIES.forEach((s) => {
      if (p.specialties[s.key]) {
        c[s.key]++;
        // Captain-Medics also count as Captains
        if (s.key === "CaptainParamedic") c["Captain"]++;
      }
    });
  });

  return c;
}


export function capFor(key) {
  switch (key) {
    case "BattalionChief":
      return 1;
    case "ActingBattalion":
      return RULES.actingBattalionMax;
    case "Captain":
      return RULES.captainMin;
    case "CaptainParamedic":
      return RULES.captainParamedicMin;
    case "ActingCaptain":
      return RULES.actingCaptainMin;
    case "Paramedic":
      return RULES.paramedicMin;
    case "HazMat":
      return RULES.hazmatMax;
    case "WaterRescue":
      return RULES.waterMax;
    case "Wildland":
      return RULES.wildlandMax;
    default:
      return Infinity;
  }
}

export function minFor(key) {
  switch (key) {
    case "BattalionChief":
      return 1;
    case "ActingBattalion":
      return RULES.actingBattalionMin;
    case "Captain":
      return RULES.captainMin;
    case "CaptainParamedic":
      return RULES.captainParamedicMin;
    case "ActingCaptain":
      return RULES.actingCaptainMin;
    case "Paramedic":
      return RULES.paramedicMin;
    case "HazMat":
      return RULES.hazmatMin;
    case "WaterRescue":
      return RULES.waterMin;
    case "Wildland":
      return RULES.wildlandMin;
    default:
      return 0;
  }
}

export function getRemainingNeedsPerShift(shifts, key) {
  const needs = { A: 0, B: 0, C: 0 };
  const min = minFor(key);
  ["A", "B", "C"].forEach((k) => {
    const c = countsFor(shifts[k])[key];
    needs[k] = Math.max(min - c, 0);
  });
  return needs;
}

export function poolMessageFor(person, pool, shifts) {
  const priority = [
    "ActingBattalion",
    "BattalionChief",
    "CaptainParamedic",
    "Paramedic",
    "ActingCaptain",
    "Captain",
    "HazMat",
    "WaterRescue",
    "Wildland",
  ];
  for (const key of priority) {
    if (!person.specialties[key]) continue;
    const title = SPECIALTIES.find((s) => s.key === key).title;
    const min = minFor(key);
    const hasMin = min > 0 && min < Infinity;
    const needs = hasMin ? getRemainingNeedsPerShift(shifts, key) : { A: 0, B: 0, C: 0 };
    const poolSupply = pool.filter((p) => p.specialties[key]).length;
    const totalNeed = hasMin ? needs.A + needs.B + needs.C : 0;
    const openByShift = {
      A: Math.max(capFor(key) - countsFor(shifts.A)[key], 0),
      B: Math.max(capFor(key) - countsFor(shifts.B)[key], 0),
      C: Math.max(capFor(key) - countsFor(shifts.C)[key], 0),
    };
    const needShifts = hasMin
      ? ["A", "B", "C"].filter((s) => needs[s] > 0 && openByShift[s] > 0)
      : [];
    if (hasMin && totalNeed > 0 && poolSupply <= totalNeed) {
      if (needShifts.length === 1) {
        return {
          shifts: needShifts,
          text: `Must choose Shift ${needShifts[0]} — only enough ${title}s left to meet minimums.`,
        };
      }
      if (needShifts.length === 2) {
        return {
          shifts: needShifts,
          text: `Must choose Shift ${needShifts.join(" or ")} — only enough ${title}s left to meet minimums.`,
        };
      }
    }
  }
  return null;
}