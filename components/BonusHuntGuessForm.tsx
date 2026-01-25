'use client';

import { useState } from 'react';

export default function BonusHuntGuessForm({ huntId }: { huntId: string }) {
  const [twitchUserId, setTwitchUserId] = useState('');
  const [guess, setGuess] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    const response = await fetch(`/api/bonushunt/${huntId}/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ twitchUserId, guess })
    });

    if (response.ok) {
      setStatus('Tipp gespeichert.');
    } else {
      const data = await response.json();
      setStatus(data.error ?? 'Fehler beim Speichern.');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 text-sm">
      <input
        type="text"
        value={twitchUserId}
        onChange={(event) => setTwitchUserId(event.target.value)}
        placeholder="Twitch User ID"
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white"
      />
      <input
        type="number"
        value={guess}
        onChange={(event) => setGuess(event.target.value)}
        placeholder="Dein Tipp (EUR)"
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white"
      />
      <button className="rounded-full bg-obs-accent px-5 py-2 text-sm font-semibold">
        Tipp speichern
      </button>
      {status ? <p className="text-white/70">{status}</p> : null}
    </form>
  );
}
