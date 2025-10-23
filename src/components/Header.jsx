import React from 'react';


export default function Header(){
return (
<header className="no-print sticky top-0 z-40">
<div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
<div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="grid place-items-center w-9 h-9 rounded-xl bg-brand shadow-md">
<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M12 2s3 3 3 6a3 3 0 0 1-6 0C9 5 12 2 12 2Z"/>
<path d="M5 14a7 7 0 1 0 14 0c0-3.5-2-5.5-4-7.5"/>
</svg>
</div>
<div>
<p className="text-xs uppercase tracking-widest text-slate-300">North County Regional Fire Authority</p>
<h1 className="text-lg sm:text-xl font-semibold tracking-tight">Shift Bid Board</h1>
</div>
</div>
<div className="hidden md:flex items-center gap-2 text-sm text-slate-300">
<span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand"></span> Live</span>
</div>
</div>
<div className="h-1.5 bg-brand/90"></div>
</div>
</header>
);
}