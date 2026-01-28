'use client';

import { useState } from 'react';

const timezones = [
  'Europe/Berlin',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Tokyo'
];

const languages = ['Deutsch', 'English', 'Español', 'Français'];

export default function WorkspaceSettingsForm() {
  const [workspaceName, setWorkspaceName] = useState('LiveWidgets Studio');
  const [tagline, setTagline] = useState(
    'Overlays, Aktionen und Community-Tools an einem Ort.'
  );
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [timezone, setTimezone] = useState('Europe/Berlin');
  const [language, setLanguage] = useState('Deutsch');
  const [autoRecord, setAutoRecord] = useState(true);
  const [alertPreview, setAlertPreview] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saved'>('idle');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('saved');
    window.setTimeout(() => setStatus('idle'), 2400);
  };

  const handleReset = () => {
    setWorkspaceName('LiveWidgets Studio');
    setTagline('Overlays, Aktionen und Community-Tools an einem Ort.');
    setBrandColor('#6366f1');
    setTimezone('Europe/Berlin');
    setLanguage('Deutsch');
    setAutoRecord(true);
    setAlertPreview(true);
    setStatus('idle');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Workspace-Name
          <input
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            className="rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-white placeholder:text-slate-500"
            placeholder="Dein Workspace"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Brand-Farbe
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={brandColor}
              onChange={(event) => setBrandColor(event.target.value)}
              className="h-10 w-16 cursor-pointer rounded border border-white/10 bg-transparent"
            />
            <input
              value={brandColor}
              onChange={(event) => setBrandColor(event.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-white"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200 md:col-span-2">
          Kurzbeschreibung
          <textarea
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            rows={3}
            className="rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-white placeholder:text-slate-500"
            placeholder="Was sollen Team & Gäste über euch wissen?"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Standard-Sprache
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-white"
          >
            {languages.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Zeitzone
          <select
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
            className="rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-white"
          >
            {timezones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 rounded-xl border border-white/5 bg-slate-950/60 p-4 text-sm text-slate-200">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={autoRecord}
            onChange={(event) => setAutoRecord(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-slate-950/80"
          />
          Auto-Recording für neue Overlays aktivieren
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={alertPreview}
            onChange={(event) => setAlertPreview(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-slate-950/80"
          />
          Live-Alert Vorschau in der Stage anzeigen
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          {status === 'saved'
            ? 'Einstellungen gespeichert – nächster Sync in 5 Minuten.'
            : 'Letztes Update vor 12 Minuten.'}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
          >
            Zurücksetzen
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Änderungen speichern
          </button>
        </div>
      </div>
    </form>
  );
}
