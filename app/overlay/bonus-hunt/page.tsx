'use client';

import { useEffect, useMemo, useState } from 'react';

const hunt = {
  currency: '€',
  slots: [
    { id: 'slot-1', name: 'Gronk’s Gems (2€)', payout: 10.2 },
    { id: 'slot-2', name: 'Gates of Olympus (2€)', payout: 232.2 },
    { id: 'slot-3', name: 'Razor Shark (2€)', payout: 520 },
    { id: 'slot-4', name: 'Jammin’ Jars (2€)', payout: 92 },
    { id: 'slot-5', name: 'Pearl Harbor (2€)', payout: 1230 },
    { id: 'slot-6', name: 'Undead Fortune (2€)', payout: 23 },
    { id: 'slot-7', name: 'Dinopolis (2€)', payout: 120 },
    { id: 'slot-8', name: 'Wanted Dead or a Wild (2€)', payout: 840 }
  ]
};

const rotateIntervalMs = 3500;
const visibleSlots = 6;

export default function BonusHuntOverlay() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOffset((prev) => (prev + 1) % hunt.slots.length);
    }, rotateIntervalMs);

    return () => window.clearInterval(timer);
  }, []);

  const visibleList = useMemo(() => {
    const list = [];
    for (let index = 0; index < visibleSlots; index += 1) {
      const slot = hunt.slots[(offset + index) % hunt.slots.length];
      list.push(slot);
    }
    return list;
  }, [offset]);

  return (
    <div className="flex min-h-screen items-end justify-end p-8">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/85 px-5 py-4 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
          <span>Bonus Hunt</span>
          <span>{hunt.currency}</span>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          {visibleList.map((slot, index) => (
            <div
              key={`${slot.id}-${offset}-${index}`}
              className={`flex items-center justify-between ${
                index === 0
                  ? 'text-white'
                  : 'text-slate-300/90'
              }`}
            >
              <span className="truncate pr-4">{slot.name}</span>
              <span className="min-w-[72px] text-right font-semibold">
                {slot.payout.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[10px] uppercase tracking-[0.25em] text-slate-500">
          Rotating · Live Feed
        </div>
      </div>
    </div>
  );
}
