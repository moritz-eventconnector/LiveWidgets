'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const fallbackHunt = {
  currency: '€',
  slots: []
};

const rotateIntervalMs = 3500;
const visibleSlots = 6;

export default function BonusHuntOverlayClient() {
  const searchParams = useSearchParams();
  const huntId = searchParams.get('hunt') ?? 'default';
  const token = searchParams.get('token');
  const [slots, setSlots] = useState<Array<{ id: string; name: string; payout: number }>>([]);
  const [currency, setCurrency] = useState('€');
  const [offset, setOffset] = useState(0);
  const [displayOffset, setDisplayOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!huntId || huntId === 'default' || !token) {
      setIsLoading(false);
      setSlots([]);
      setCurrency('€');
      return;
    }

    let isActive = true;

    const loadHunt = async () => {
      try {
        const url = `/api/bonus-hunt/overlay/${huntId}?token=${encodeURIComponent(token)}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (isActive) {
            if (data.slots && data.slots.length > 0) {
              setSlots(data.slots);
              setCurrency(data.currency || '€');
            } else {
              setSlots([]);
              setCurrency(data.currency || '€');
            }
            setIsLoading(false);
          }
        } else {
          if (isActive) {
            setSlots([]);
            setCurrency('€');
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Failed to load hunt:', error);
        if (isActive) {
          setSlots([]);
          setCurrency('€');
          setIsLoading(false);
        }
      }
    };

    loadHunt();
    
    // Poll for updates every 5 seconds
    const pollInterval = setInterval(() => {
      if (isActive) {
        loadHunt();
      }
    }, 5000);
    
    return () => {
      isActive = false;
      clearInterval(pollInterval);
    };
  }, [huntId, token]);

  // Smooth scrolling with animation
  useEffect(() => {
    if (!slots.length || slots.length <= visibleSlots) {
      setDisplayOffset(0);
      return;
    }
    
    const timer = window.setInterval(() => {
      setOffset((prev) => (prev + 1) % slots.length);
    }, rotateIntervalMs);

    return () => window.clearInterval(timer);
  }, [slots.length]);

  // Smooth transition for display offset
  useEffect(() => {
    setDisplayOffset(offset);
  }, [offset]);

  const visibleList = useMemo(() => {
    if (!slots.length) return [];
    const list = [];
    for (let index = 0; index < visibleSlots; index += 1) {
      const slot = slots[(displayOffset + index) % slots.length];
      list.push(slot);
    }
    return list;
  }, [displayOffset, slots]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-end justify-end p-8">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/85 px-5 py-4 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
            <span>Bonus Hunt</span>
            <span>{currency}</span>
          </div>
          <div className="mt-3 flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex min-h-screen items-end justify-end p-8">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/85 px-5 py-4 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
            <span>Bonus Hunt</span>
            <span>{currency}</span>
          </div>
          <div className="mt-3 text-sm text-slate-400">
            Noch keine Slots vorhanden
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-end justify-end p-8">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/85 px-5 py-4 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
          <span>Bonus Hunt</span>
          <span>{currency}</span>
        </div>
        <div className="mt-3 space-y-2 text-sm overflow-hidden">
          {visibleList.map((slot, index) => (
            <div
              key={`${slot.id}-${displayOffset}-${index}`}
              className="flex items-center justify-between transition-all duration-700 ease-in-out"
              style={{
                opacity: index === 0 ? 1 : 0.9 - index * 0.1,
                transform: `translateY(${index === 0 ? 0 : 2}px) scale(${1 - index * 0.02})`
              }}
            >
              <span className={`truncate pr-4 transition-colors duration-500 ${
                index === 0 ? 'text-white' : 'text-slate-300/90'
              }`}>
                {slot.name}
              </span>
              <span className={`min-w-[72px] text-right font-semibold transition-colors duration-500 ${
                index === 0 ? 'text-white' : 'text-slate-300/90'
              }`}>
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
