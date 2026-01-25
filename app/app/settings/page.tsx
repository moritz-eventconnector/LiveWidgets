import SectionCard from '@/components/SectionCard';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-white/70">
          Overlay Token, Moderatoren und Channel Einstellungen.
        </p>
      </div>
      <SectionCard title="Overlay Token">
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
          <span>Aktueller Token: ••••••••</span>
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold">
            Token regenerieren
          </button>
        </div>
      </SectionCard>
      <SectionCard title="Moderatoren">
        <form className="flex flex-wrap gap-3 text-sm">
          <input
            type="text"
            placeholder="Twitch Login"
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-2"
          />
          <button className="rounded-full bg-obs-accent px-4 py-2 text-sm font-semibold">
            Invite senden
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
