'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import CreatorShell from '../../components/creator-shell';

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

const huntStatusLabels: Record<HuntStatus, string> = {
  prepared: 'Vorbereitet',
  active: 'Aktiv',
  done: 'Vergangen'
};

const storageKeyForHunt = (huntId: string) =>
  `livewidgets:bonus-hunt:${huntId}`;

const initialHunts: BonusHuntEntry[] = [
  {
    id: 'hunt-24',
    title: 'Bonus Hunt #24',
    status: 'active',
    updatedAt: 'Heute, 18:30',
    summary: '10 Slots · 500 € Startbalance',
    settings: {
      title: 'Bonus Hunt #24',
      startBalance: '500',
      targetCashout: '1500',
      currency: '€'
    },
    slots: [
      {
        id: 'slot-1',
        name: 'Gates of Olympus',
        provider: 'Pragmatic Play',
        stake: '1.00',
        targetSpins: '100',
        collectedSpins: '60',
        payout: '0',
        status: 'spinning'
      },
      {
        id: 'slot-2',
        name: 'Book of Dead',
        provider: 'Play’n GO',
        stake: '0.80',
        targetSpins: '80',
        collectedSpins: '80',
        payout: '320',
        status: 'done'
      }
    ]
  },
  {
    id: 'hunt-23',
    title: 'Bonus Hunt #23',
    status: 'done',
    updatedAt: '02.03.2024',
    summary: '12 Slots · 400 € Startbalance',
    settings: {
      title: 'Bonus Hunt #23',
      startBalance: '400',
      targetCashout: '1200',
      currency: '€'
    },
    slots: [
      {
        id: 'slot-3',
        name: 'Sweet Bonanza',
        provider: 'Pragmatic Play',
        stake: '0.60',
        targetSpins: '80',
        collectedSpins: '80',
        payout: '540',
        status: 'done'
      }
    ]
  },
  {
    id: 'hunt-25',
    title: 'Bonus Hunt #25 (Draft)',
    status: 'prepared',
    updatedAt: 'Gestern, 21:10',
    summary: '5 Slots · 300 € Startbalance',
    settings: {
      title: 'Bonus Hunt #25',
      startBalance: '300',
      targetCashout: '900',
      currency: '€'
    },
    slots: []
  }
];

export default function BonusHuntClient({
  baseUrl,
  overlayToken,
  channelSlug
}: BonusHuntClientProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [hunts, setHunts] = useState<BonusHuntEntry[]>(() => initialHunts);
  const [activeHuntId, setActiveHuntId] = useState(initialHunts[0]?.id ?? '');
  const [huntSettings, setHuntSettings] = useState<HuntSettings>(
    initialHunts[0]?.settings ?? emptyHuntSettings
  );
  const [slotDraft, setSlotDraft] = useState(emptySlot);
  const [slots, setSlots] = useState<BonusSlot[]>(
    initialHunts[0]?.slots ?? []
  );
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

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
    if (!slotDraft.name.trim()) return;
    setSlots((prev) => [
      ...prev,
      {
        id: `slot-${Date.now()}`,
        ...slotDraft
      }
    ]);
    setSlotDraft(emptySlot);
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

  const handleSelectHunt = (id: string) => {
    const hunt = hunts.find((entry) => entry.id === id);
    if (!hunt) return;
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(storageKeyForHunt(id));
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as {
            settings?: HuntSettings;
            slots?: BonusSlot[];
          };
          setActiveHuntId(id);
          setHuntSettings(parsed.settings ?? hunt.settings);
          setSlots(parsed.slots ?? hunt.slots);
          return;
        } catch {
          // ignore parse errors and fall back to stored hunt
        }
      }
    }
    setActiveHuntId(id);
    setHuntSettings(hunt.settings);
    setSlots(hunt.slots);
  };

  const handleCreateHunt = () => {
    const existingNumbers = hunts
      .map((hunt) => Number(hunt.title.match(/#(\d+)/)?.[1]))
      .filter((value) => !Number.isNaN(value));
    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    const title = `Bonus Hunt #${nextNumber}`;
    const newHunt: BonusHuntEntry = {
      id: `hunt-${Date.now()}`,
      title,
      status: 'prepared',
      updatedAt: 'Gerade eben',
      summary: 'Noch keine Slots',
      settings: {
        title,
        startBalance: '',
        targetCashout: '',
        currency: '€'
      },
      slots: []
    };
    setHunts((prev) => [newHunt, ...prev]);
    setActiveHuntId(newHunt.id);
    setHuntSettings(newHunt.settings);
    setSlots([]);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!activeHuntId || hasLoadedFromStorage) return;
    const stored = window.localStorage.getItem(storageKeyForHunt(activeHuntId));
    if (!stored) {
      setHasLoadedFromStorage(true);
      return;
    }
    try {
      const parsed = JSON.parse(stored) as {
        settings?: HuntSettings;
        slots?: BonusSlot[];
      };
      if (parsed.settings) {
        setHuntSettings(parsed.settings);
      }
      if (parsed.slots) {
        setSlots(parsed.slots);
      }
    } catch {
      // ignore parse errors
    } finally {
      setHasLoadedFromStorage(true);
    }
  }, [activeHuntId, hasLoadedFromStorage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!activeHuntId) return;
    const payload = JSON.stringify({
      settings: huntSettings,
      slots
    });
    window.localStorage.setItem(storageKeyForHunt(activeHuntId), payload);
    setHunts((prev) =>
      prev.map((hunt) =>
        hunt.id === activeHuntId
          ? {
              ...hunt,
              settings: huntSettings,
              slots,
              summary: slots.length
                ? `${slots.length} Slots · ${huntSettings.startBalance || 0} ${
                    huntSettings.currency
                  } Startbalance`
                : 'Noch keine Slots',
              updatedAt: 'Gerade eben'
            }
          : hunt
      )
    );
  }, [activeHuntId, huntSettings, slots]);

  return (
    <CreatorShell
      title="Bonus Hunt"
      subtitle="Freispiele sauber tracken, Ergebnisse teilen und deinen Chat aktiv einbinden."
    >
      <div className="flex flex-col gap-8">
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
            {hunts.map((hunt) => (
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
            ))}
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
                      handleSlotChange(
                        slot.id,
                        'status',
                        event.target.value
                      )
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
                      handleSlotChange(
                        slot.id,
                        'targetSpins',
                        event.target.value
                      )
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
    </CreatorShell>
  );
}
