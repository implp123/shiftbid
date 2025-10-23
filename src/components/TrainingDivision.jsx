import React from 'react';
import { SPECIALTIES, BADGE } from '../lib/roster.js';


export default function TrainingDivision({ td, onDrop, onDragEnter, onDragLeave, allowDrop, dragOver }){
return (
<div
onDragOver={allowDrop}
onDrop={onDrop}
onDragEnter={onDragEnter}
onDragLeave={onDragLeave}
className={`td-card glass rounded-2xl p-4 w-full md:w-72 ${dragOver ? 'drop-glow' : ''}`}
>
<div className="flex items-center justify-between">
<div className="font-semibold flex items-center gap-2">
<span className="inline-flex w-6 h-6 rounded-lg bg-brand/10 text-brand items-center justify-center">★</span>
<span>Training Division</span>
</div>
<span className="text-xs text-slate-600">{td.length}/1</span>
</div>


<div className="min-h-[72px] mt-2">
{td.length===0 ? (
<div className="text-sm text-slate-600 italic">Drop one firefighter here. Removed from all shift logic.</div>
) : (
<div className="p-3 ring-1 ring-amber-200 rounded-xl bg-amber-50 cursor-not-allowed">
<div className="font-medium">{td[0].name}</div>
<div className="mt-1 flex flex-wrap gap-1">
{SPECIALTIES.filter(s=>td[0].specialties[s.key]).map(s=> (
<span key={s.key} className={`text-xs px-2 py-0.5 rounded-full ${BADGE[s.key]}`}>{s.title}</span>
))}
</div>
</div>
)}
</div>
</div>
);
}