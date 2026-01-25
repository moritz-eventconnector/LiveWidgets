import SectionCard from '@/components/SectionCard';

export default function TwitchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Twitch Integration</h1>
        <p className="mt-2 text-sm text-white/70">
          Bot-Verbindung, OAuth und Command-Management.
        </p>
      </div>
      <SectionCard title="OAuth Status" description="Verbunden mit Twitch.">
        <div className="text-sm text-white/60">Scopes: user:read:email</div>
      </SectionCard>
      <SectionCard title="Bot Account" description="LiveWidgetsBot ist aktiv.">
        <div className="text-sm text-white/60">Channel: livewidgetsbot</div>
      </SectionCard>
      <SectionCard title="Commands Overview">
        <ul className="space-y-2 text-sm text-white/70">
          <li>!sr &lt;slot&gt; – Slot Request einreichen</li>
          <li>!join – Turnier beitreten</li>
          <li>!bh lock – Bonus Hunt Guessing schließen</li>
        </ul>
      </SectionCard>
    </div>
  );
}
