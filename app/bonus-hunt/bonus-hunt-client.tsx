'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
const workflowStages = [
  {
    title: 'Slots erfassen',
    detail:
      'Liste alle Slots mit Einsatz, Anbieter und Ziel-Freispielen, damit der Hunt strukturiert bleibt.'
  },
  {
    title: 'Freispiele sammeln',
    detail:
      'Markiere Freispiele pro Slot und tracke, welche Spins noch offen sind.'
  },
  {
    title: 'Ergebnisse auswerten',
    detail:
      'Dokumentiere Gewinne, Highlights und ROI direkt nach der Session.'
  }
];

const statusLabels = {
  open: 'Offen',
  spinning: 'Spins laufen',
  done: 'Erledigt'
} as const;

type SlotStatus = keyof typeof statusLabels;

type BonusSlot = {
  id: string;
  name: string;
  provider: string;
  stake: string;
  targetSpins: string;
  collectedSpins: string;
  payout: string;
  status: SlotStatus;
};

type HuntSettings = {
  title: string;
  startBalance: string;
  targetCashout: string;
  currency: string;
};

type HuntStatus = 'prepared' | 'active' | 'done';

type BonusHuntEntry = {
  id: string;
  title: string;
  status: HuntStatus;
  updatedAt: string;
  summary: string;
  settings: HuntSettings;
  slots: BonusSlot[];
};

type BonusHuntClientProps = {
  baseUrl: string;
  overlayToken: string | null;
  channelSlug: string | null;
  isDefaultChannel?: boolean;
};

const emptySlot: Omit<BonusSlot, 'id'> = {
  name: '',
  provider: '',
  stake: '',
  targetSpins: '',
  collectedSpins: '',
  payout: '',
  status: 'open'
};

const emptyHuntSettings: HuntSettings = {
  title: '',
  startBalance: '',
  targetCashout: '',
  currency: '€'
};

const huntStatusLabels: Record<HuntStatus, string> = {
  prepared: 'Vorbereitet',
  active: 'Aktiv',
  done: 'Vergangen'
};

const storageKeyForHunt = (huntId: string) =>
  `livewidgets:bonus-hunt:${huntId}`;

export default function BonusHuntClient({
  baseUrl,
  overlayToken,
  channelSlug,
  isDefaultChannel = false
}: BonusHuntClientProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [hunts, setHunts] = useState<BonusHuntEntry[]>([]);
  const [activeHuntId, setActiveHuntId] = useState('');
  const [huntSettings, setHuntSettings] = useState<HuntSettings>(emptyHuntSettings);
  const [slotDraft, setSlotDraft] = useState(emptySlot);
  const [slots, setSlots] = useState<BonusSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasMigratedRef = useRef(false);

  const progress = useMemo(() => {
    const total = slots.length;
    const done = slots.filter((slot) => slot.status === 'done').length;
    const totalTarget = slots.reduce(
      (sum, slot) => sum + Number(slot.targetSpins || 0),
      0
    );
    const collected = slots.reduce(
      (sum, slot) => sum + Number(slot.collectedSpins || 0),
      0
    );
    const payoutTotal = slots.reduce(
      (sum, slot) => sum + Number(slot.payout || 0),
      0
    );

    return {
      total,
      done,
      totalTarget,
      collected,
      payoutTotal
    };
  }, [slots]);

  const roi = useMemo(() => {
    const start = Number(huntSettings.startBalance || 0);
    if (start <= 0) return 0;
    return ((progress.payoutTotal - start) / start) * 100;
  }, [huntSettings.startBalance, progress.payoutTotal]);

  const overlayUrl = useMemo(() => {
    const url = new URL(`${baseUrl}/overlay/bonus-hunt`);
    if (overlayToken) {
      url.searchParams.set('token', overlayToken);
    }
    if (activeHuntId) {
      url.searchParams.set('hunt', activeHuntId);
    }
    return url.toString();
  }, [activeHuntId, baseUrl, overlayToken]);
  const tipsUrl = channelSlug
    ? `${baseUrl}/bonus-hunt/${channelSlug}/tipps`
    : `${baseUrl}/bonus-hunt/tipps`;

  const overlayLinks = [
    {
      label: 'OBS Overlay',
      value: overlayUrl,
      note: overlayToken
        ? 'Dein personalisiertes Overlay für OBS.'
        : 'Bitte einloggen, um die personalisierte URL zu erhalten.'
    },
    {
      label: 'Community Tipps',
      value: tipsUrl,
      note: 'Chat tippt Bonus-Auszahlungen'
    }
  ];

  const handleCopy = async (value: string) => {
    if (typeof navigator === 'undefined') return;
    await navigator.clipboard.writeText(value);
    setCopiedValue(value);
    window.setTimeout(() => setCopiedValue(null), 2000);
  };

  const handleAddSlot = () => {
    if (!slotDraft.name.trim()) {
      setError('Bitte gib einen Slot-Namen ein.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    const newSlot: BonusSlot = {
      id: `slot-${Date.now()}`,
      ...slotDraft
    };
    setSlots((prev) => [...prev, newSlot]);
    setSlotDraft(emptySlot);
    setError(null);
  };

  const handleSlotChange = (
    id: string,
    field: keyof BonusSlot,
    value: string
  ) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === id
          ? {
              ...slot,
              [field]: value
            }
          : slot
      )
    );
  };

  const handleRemove = (id: string) => {
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  const handleSelectHunt = async (id: string) => {
    const hunt = hunts.find((entry) => entry.id === id);
    if (!hunt) return;
    
    setActiveHuntId(id);
    setHuntSettings(hunt.settings);
    setSlots(hunt.slots);
    setError(null);
    
    // Load full hunt data from API
    try {
      const response = await fetch(`/api/bonus-hunt/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.hunt) {
          setHuntSettings(data.hunt.settings);
          setSlots(data.hunt.slots);
        }
      } else {
        setError('Hunt konnte nicht geladen werden.');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Failed to load hunt:', error);
      setError('Fehler beim Laden des Hunts.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCreateHunt = async () => {
    setError(null);
    const existingNumbers = hunts
      .map((hunt) => Number(hunt.title.match(/#(\d+)/)?.[1]))
      .filter((value) => !Number.isNaN(value));
    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    const title = `Bonus Hunt #${nextNumber}`;
    
    try {
      const response = await fetch('/api/bonus-hunts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          settings: {
            title,
            startBalance: '',
            targetCashout: '',
            currency: '€'
          },
          slots: []
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newHunt = data.hunt;
        setHunts((prev) => [newHunt, ...prev]);
        setActiveHuntId(newHunt.id);
        setHuntSettings(newHunt.settings);
        setSlots([]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Hunt konnte nicht erstellt werden.');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Failed to create hunt:', error);
      setError('Fehler beim Erstellen des Hunts. Bitte versuche es erneut.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteHunt = async (id: string) => {
    if (!confirm('Möchtest du diesen Hunt wirklich löschen?')) {
      return;
    }
    
    setError(null);
    try {
      const response = await fetch(`/api/bonus-hunt/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        let remainingHunts: BonusHuntEntry[] = [];
        setHunts((prev) => {
          remainingHunts = prev.filter((hunt) => hunt.id !== id);
          return remainingHunts;
        });
        
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(storageKeyForHunt(id));
        }
        
        if (id === activeHuntId) {
          const nextHunt = remainingHunts[0];
          if (nextHunt) {
            setActiveHuntId(nextHunt.id);
            setHuntSettings(nextHunt.settings);
            setSlots(nextHunt.slots);
          } else {
            setActiveHuntId('');
            setHuntSettings(emptyHuntSettings);
            setSlots([]);
          }
        }
      } else {
        setError('Hunt konnte nicht gelöscht werden.');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Failed to delete hunt:', error);
      setError('Fehler beim Löschen des Hunts.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Load hunts from API on mount
  useEffect(() => {
    let isActive = true;
    
    const loadHunts = async () => {
      setLoadError(null);
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/bonus-hunts', {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Laden fehlgeschlagen');
        }
        
        const data = await response.json();
        const loadedHunts = data.hunts || [];
        
        if (!isActive) return;
        
        setHunts(loadedHunts);
        
        // Migrate localStorage data to DB if not already migrated
        if (!hasMigratedRef.current && typeof window !== 'undefined') {
          hasMigratedRef.current = true;
          const keys = Object.keys(window.localStorage);
          const huntKeys = keys.filter((key) => key.startsWith('livewidgets:bonus-hunt:'));
          
          for (const key of huntKeys) {
            const huntId = key.replace('livewidgets:bonus-hunt:', '');
            // Only migrate if hunt doesn't exist in DB
            if (!loadedHunts.find((h: BonusHuntEntry) => h.id === huntId)) {
              try {
                const stored = window.localStorage.getItem(key);
                if (stored) {
                  const parsed = JSON.parse(stored) as {
                    settings?: HuntSettings;
                    slots?: BonusSlot[];
                  };
                  // Try to create in DB (will fail if not authenticated, which is fine)
                  await fetch('/api/bonus-hunts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: parsed.settings?.title || `Migrated Hunt ${huntId}`,
                      settings: parsed.settings || emptyHuntSettings,
                      slots: parsed.slots || []
                    })
                  }).catch(() => {
                    // Ignore errors during migration
                  });
                }
              } catch {
                // Ignore parse errors
              }
            }
          }
        }
        
        // Only set active hunt if none is currently selected
        if (loadedHunts.length > 0) {
          setActiveHuntId((currentId) => {
            if (!currentId) {
              return loadedHunts[0].id;
            }
            return currentId;
          });
          // Set initial hunt data if no active hunt is set
          const currentActiveHunt = loadedHunts.find((h: BonusHuntEntry) => h.id === activeHuntId);
          if (!currentActiveHunt && loadedHunts.length > 0) {
            setHuntSettings(loadedHunts[0].settings);
            setSlots(loadedHunts[0].slots);
          }
        }
      } catch (error) {
        console.error('Failed to load hunts:', error);
        if (isActive) {
          setLoadError('Die Bonus Hunts konnten nicht geladen werden. Bitte lade die Seite neu.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };
    
    loadHunts();
    
    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced save to API
  const saveHunt = useCallback(async () => {
    if (!activeHuntId || isSaving || isLoading) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/bonus-hunt/${activeHuntId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: huntSettings.title,
          settings: huntSettings,
          slots,
          status: hunts.find((h) => h.id === activeHuntId)?.status || 'prepared'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const updatedHunt = data.hunt;
        setHunts((prev) =>
          prev.map((hunt) =>
            hunt.id === activeHuntId ? updatedHunt : hunt
          )
        );
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Speichern fehlgeschlagen.');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Failed to save hunt:', error);
      setError('Fehler beim Speichern. Änderungen werden automatisch erneut versucht.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  }, [activeHuntId, huntSettings, slots, hunts, isSaving, isLoading]);

  // Auto-save with debouncing
  useEffect(() => {
    if (!activeHuntId || isLoading) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveHunt();
    }, 1000); // 1 second debounce
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [activeHuntId, huntSettings, slots, isLoading, saveHunt]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-sm text-slate-400">Lade Bonus Hunts...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6">
        <p className="text-sm font-semibold text-rose-100">{loadError}</p>
        <button
          className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-white"
          type="button"
          onClick={() => window.location.reload()}
        >
          Seite neu laden
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {isDefaultChannel && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-yellow-400 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-400 mb-1">
                Twitch-Integration nicht aktiv
              </h3>
              <p className="text-sm text-yellow-300/90">
                Bonus-Hunt funktioniert vollständig (Eintragen, Overlay, etc.), aber Twitch-Funktionen wie Chat-Integration sind aktuell nicht verfügbar. 
                Sobald die Twitch-Anbindung implementiert ist, werden diese Funktionen automatisch aktiviert.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
            Hinweis
          </p>
          <p className="mt-2">{error}</p>
        </div>
      )}
      
      {isSaving && (
        <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/10 px-5 py-4 text-sm text-indigo-100">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
            <p>Speichere Änderungen...</p>
          </div>
        </div>
      )}
      
      <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Deine Bonus Hunts
            </h2>
            <p className="text-sm text-slate-300">
              Sieh vergangene, vorbereitete und aktive Hunts auf einen Blick.
            </p>
          </div>
          <button
            className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={handleCreateHunt}
          >
            Neuen Hunt erstellen
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {hunts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center">
              <p className="text-sm text-slate-400">
                Noch keine Bonus Hunts vorhanden. Erstelle deinen ersten Hunt!
              </p>
            </div>
          ) : (
            hunts.map((hunt) => (
            <button
              key={hunt.id}
              className={`flex flex-col gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                hunt.id === activeHuntId
                  ? 'border-indigo-400/60 bg-indigo-500/10'
                  : 'border-white/10 bg-slate-900/70 hover:border-indigo-400/40 hover:bg-slate-900/90'
              }`}
              type="button"
              onClick={() => handleSelectHunt(hunt.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-white">
                  {hunt.title}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-200">
                  {huntStatusLabels[hunt.status]}
                </span>
              </div>
              <p className="text-xs text-slate-400">{hunt.summary}</p>
              <p className="text-xs text-slate-500">{hunt.updatedAt}</p>
              <span className="mt-2 flex justify-end">
                <span
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300"
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteHunt(hunt.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      handleDeleteHunt(hunt.id);
                    }
                  }}
                >
                  Löschen
                </span>
              </span>
            </button>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
            Hunt Überblick
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Hunt Titel
              <input
                className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white"
                value={huntSettings.title}
                onChange={(event) =>
                  setHuntSettings((prev) => ({
                    ...prev,
                    title: event.target.value
                  }))
                }
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Start Balance
              <div className="flex items-center gap-2">
                <input
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white"
                  value={huntSettings.startBalance}
                  onChange={(event) =>
                    setHuntSettings((prev) => ({
                      ...prev,
                      startBalance: event.target.value
                    }))
                  }
                />
                <span className="text-sm text-slate-300">
                  {huntSettings.currency}
                </span>
              </div>
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Ziel Cashout
              <div className="flex items-center gap-2">
                <input
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white"
                  value={huntSettings.targetCashout}
                  onChange={(event) =>
                    setHuntSettings((prev) => ({
                      ...prev,
                      targetCashout: event.target.value
                    }))
                  }
                />
                <span className="text-sm text-slate-300">
                  {huntSettings.currency}
                </span>
              </div>
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Währung
              <select
                className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white"
                value={huntSettings.currency}
                onChange={(event) =>
                  setHuntSettings((prev) => ({
                    ...prev,
                    currency: event.target.value
                  }))
                }
              >
                <option value="€">Euro (€)</option>
                <option value="$">US-Dollar ($)</option>
                <option value="£">Pfund (£)</option>
              </select>
            </label>
          </div>
          <div className="mt-6 grid gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 md:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Slots gesamt
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {progress.total}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Freispiele gesammelt
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {progress.collected}/{progress.totalTarget}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Auszahlungen
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {progress.payoutTotal} {huntSettings.currency}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                ROI
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {roi.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {overlayLinks.map((overlay) => (
            <div
              key={overlay.label}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                {overlay.label}
              </p>
              <p className="mt-3 text-base font-semibold text-white break-all">
                {overlay.value}
              </p>
              <p className="mt-1 text-xs text-slate-300">{overlay.note}</p>
              <button
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                onClick={() => handleCopy(overlay.value)}
                disabled={!overlayToken && overlay.label === 'OBS Overlay'}
              >
                {copiedValue === overlay.value
                  ? 'Link kopiert'
                  : 'Overlay URL kopieren'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Slots & Freispiele
            </h2>
            <p className="text-sm text-slate-300">
              Halte fest, wie viele Freispiele gesammelt wurden und welche Slots
              noch offen sind.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200">
            {progress.done} von {progress.total} erledigt
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:grid-cols-6">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 md:col-span-2">
            Slot Name
            <input
              className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white"
              value={slotDraft.name}
              onChange={(event) =>
                setSlotDraft((prev) => ({
                  ...prev,
                  name: event.target.value
                }))
              }
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            Anbieter
            <input
              className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white"
              value={slotDraft.provider}
              onChange={(event) =>
                setSlotDraft((prev) => ({
                  ...prev,
                  provider: event.target.value
                }))
              }
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            Einsatz
            <input
              className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white"
              value={slotDraft.stake}
              onChange={(event) =>
                setSlotDraft((prev) => ({
                  ...prev,
                  stake: event.target.value
                }))
              }
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            Ziel Spins
            <input
              className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white"
              value={slotDraft.targetSpins}
              onChange={(event) =>
                setSlotDraft((prev) => ({
                  ...prev,
                  targetSpins: event.target.value
                }))
              }
            />
          </label>
          <div className="flex items-end">
            <button
              className="w-full rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-white"
              type="button"
              onClick={handleAddSlot}
            >
              Slot hinzufügen
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:grid-cols-[1.4fr_1.1fr_repeat(4,_minmax(0,1fr))_auto]"
            >
              <div>
                <p className="text-sm font-semibold text-white">{slot.name}</p>
                <p className="text-xs text-slate-400">{slot.provider}</p>
              </div>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                Status
                <select
                  className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white"
                  value={slot.status}
                  onChange={(event) =>
                    handleSlotChange(slot.id, 'status', event.target.value)
                  }
                >
                  {(Object.keys(statusLabels) as SlotStatus[]).map((key) => (
                    <option key={key} value={key}>
                      {statusLabels[key]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                Einsatz
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white"
                  value={slot.stake}
                  onChange={(event) =>
                    handleSlotChange(slot.id, 'stake', event.target.value)
                  }
                />
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                Ziel Spins
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white"
                  value={slot.targetSpins}
                  onChange={(event) =>
                    handleSlotChange(slot.id, 'targetSpins', event.target.value)
                  }
                />
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                Gesammelt
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white"
                  value={slot.collectedSpins}
                  onChange={(event) =>
                    handleSlotChange(
                      slot.id,
                      'collectedSpins',
                      event.target.value
                    )
                  }
                />
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                Auszahlung
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white"
                  value={slot.payout}
                  onChange={(event) =>
                    handleSlotChange(slot.id, 'payout', event.target.value)
                  }
                />
              </label>
              <div className="flex items-end">
                <button
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white"
                  type="button"
                  onClick={() => handleRemove(slot.id)}
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
        <h2 className="text-lg font-semibold text-white">
          Workflow für deine Hunts
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {workflowStages.map((stage) => (
            <div
              key={stage.title}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-4"
            >
              <p className="text-sm font-semibold text-white">{stage.title}</p>
              <p className="mt-2 text-xs text-slate-300">{stage.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-6">
        <h3 className="text-base font-semibold text-white">
          Hunt starten & teilen
        </h3>
        <p className="mt-2 text-sm text-slate-200">
          Öffne das Overlay im Stream, teile den Tipp-Link im Chat und behalte
          den Fortschritt live im Blick.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white"
            type="button"
          >
            Hunt aktivieren
          </button>
          <Link
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white"
            href="/"
          >
            Zurück zum Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
