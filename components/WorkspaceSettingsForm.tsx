'use client';

import { useEffect, useState } from 'react';

import {
  defaultWorkspaceSettings,
  type WorkspaceSettingsPayload
} from '@/lib/workspace-settings';

const timezones = [
  'Europe/Berlin',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Tokyo'
];

const languages = ['Deutsch', 'English', 'Español', 'Français'];

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type LoadStatus = 'loading' | 'ready' | 'error';

export default function WorkspaceSettingsForm() {
  const [workspaceName, setWorkspaceName] = useState(
    defaultWorkspaceSettings.workspaceName
  );
  const [tagline, setTagline] = useState(defaultWorkspaceSettings.tagline);
  const [brandColor, setBrandColor] = useState(
    defaultWorkspaceSettings.brandColor
  );
  const [timezone, setTimezone] = useState(
    defaultWorkspaceSettings.timezone
  );
  const [language, setLanguage] = useState(
    defaultWorkspaceSettings.language
  );
  const [autoRecord, setAutoRecord] = useState(
    defaultWorkspaceSettings.autoRecord
  );
  const [alertPreview, setAlertPreview] = useState(
    defaultWorkspaceSettings.alertPreview
  );
  const [initialSettings, setInitialSettings] = useState(
    defaultWorkspaceSettings
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadSettings = async () => {
      setLoadStatus('loading');
      setErrorMessage(null);

      try {
        const response = await fetch('/api/workspace-settings', {
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Laden fehlgeschlagen');
        }

        const data: { settings: WorkspaceSettingsPayload } =
          await response.json();

        if (!isActive) {
          return;
        }

        setWorkspaceName(data.settings.workspaceName);
        setTagline(data.settings.tagline);
        setBrandColor(data.settings.brandColor);
        setTimezone(data.settings.timezone);
        setLanguage(data.settings.language);
        setAutoRecord(data.settings.autoRecord);
        setAlertPreview(data.settings.alertPreview);
        setInitialSettings(data.settings);
        setLoadStatus('ready');
      } catch (error) {
        if (!isActive) {
          return;
        }
        setLoadStatus('error');
        setErrorMessage(
          'Die Workspace-Daten konnten nicht geladen werden. Bitte versuche es erneut.'
        );
      }
    };

    void loadSettings();

    return () => {
      isActive = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveStatus('saving');
    setErrorMessage(null);

    const payload: WorkspaceSettingsPayload = {
      workspaceName,
      tagline,
      brandColor,
      timezone,
      language,
      autoRecord,
      alertPreview
    };

    try {
      const response = await fetch('/api/workspace-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Speichern fehlgeschlagen');
      }

      const data: { settings: WorkspaceSettingsPayload } =
        await response.json();
      setInitialSettings(data.settings);
      setSaveStatus('saved');
      window.setTimeout(() => setSaveStatus('idle'), 2400);
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage(
        'Speichern fehlgeschlagen. Bitte prüfe deine Verbindung und versuche es erneut.'
      );
    }
  };

  const handleReset = () => {
    setWorkspaceName(initialSettings.workspaceName);
    setTagline(initialSettings.tagline);
    setBrandColor(initialSettings.brandColor);
    setTimezone(initialSettings.timezone);
    setLanguage(initialSettings.language);
    setAutoRecord(initialSettings.autoRecord);
    setAlertPreview(initialSettings.alertPreview);
    setSaveStatus('idle');
    setErrorMessage(null);
  };

  const isBusy = loadStatus === 'loading' || saveStatus === 'saving';

  const statusMessage = (() => {
    if (loadStatus === 'loading') {
      return 'Einstellungen werden geladen…';
    }
    if (loadStatus === 'error') {
      return 'Einstellungen konnten nicht geladen werden.';
    }
    if (saveStatus === 'saving') {
      return 'Speichert Änderungen…';
    }
    if (saveStatus === 'saved') {
      return 'Einstellungen gespeichert – nächster Sync in 5 Minuten.';
    }
    if (saveStatus === 'error') {
      return 'Speichern fehlgeschlagen.';
    }
    return 'Letztes Update vor wenigen Sekunden.';
  })();

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
        <div className="text-xs text-slate-400">{statusMessage}</div>
        {errorMessage ? (
          <div className="w-full text-xs text-rose-200">{errorMessage}</div>
        ) : null}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 disabled:opacity-60"
            disabled={isBusy}
          >
            Zurücksetzen
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
            disabled={isBusy}
          >
            {saveStatus === 'saving' ? 'Speichern…' : 'Änderungen speichern'}
          </button>
        </div>
      </div>
    </form>
  );
}
