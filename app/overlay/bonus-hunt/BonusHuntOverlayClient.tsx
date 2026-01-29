'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const fallbackHunt = {
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

const storageKeyForHunt = (huntId: string) =>
  `livewidgets:bonus-hunt:${huntId}`;

export default function BonusHuntOverlayClient() {
  const searchParams = useSearchParams();
  const huntId = searchParams.get('hunt') ?? 'default';
  const [slots, setSlots] = useState(fallbackHunt.slots);
  const [currency, setCurrency] = useState(fallbackHunt.currency);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(storageKeyForHunt(huntId));
    if (!stored) {
      setSlots(fallbackHunt.slots);
      setCurrency(fallbackHunt.currency);
      return;
    }
    try {
      const parsed = JSON.parse(stored) as {
        settings?: { currency?: string };
        slots?: { id?: string; name?: string; stake?: string; payout?: string }[];
      };
      const nextCurrency = parsed.settings?.currency ?? fallbackHunt.currency;
      const mappedSlots =
        parsed.slots?.map((slot, index) => {
          const payout = Number(slot.payout ?? 0);
          const stakeValue = Number(slot.stake ?? 0);
          const stakeLabel = stakeValue
            ? ` (${stakeValue.toFixed(2)}${nextCurrency})`
            : '';
          return {
            id: slot.id ?? `slot-${index}`,
            name: `${slot.name ?? 'Unbekannter Slot'}${stakeLabel}`,
            payout
          };
        }) ?? [];
      setCurrency(nextCurrency);
      setSlots(mappedSlots.length ? mappedSlots : fallbackHunt.slots);
    } catch {
      setSlots(fallbackHunt.slots);
      setCurrency(fallbackHunt.currency);
    }
  }, [huntId]);

  useEffect(() => {
    if (!slots.length) return;
    const timer = window.setInterval(() => {
      setOffset((prev) => (prev + 1) % slots.length);
    }, rotateIntervalMs);

    return () => window.clearInterval(timer);
  }, [slots.length]);

  const visibleList = useMemo(() => {
    if (!slots.length) return [];
    const list = [];
    for (let index = 0; index < visibleSlots; index += 1) {
      const slot = slots[(offset + index) % slots.length];
      list.push(slot);
    }
    return list;
  }, [offset, slots]);

  return (
    <div className="flex min-h-screen items-end justify-end p-8">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/85 px-5 py-4 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
          <span>Bonus Hunt</span>
          <span>{currency}</span>
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
                {currency}
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
