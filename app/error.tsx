'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[LiveWidgets][error-boundary]', {
      message: error.message,
      digest: error.digest,
      stack: error.stack
    });
  }, [error]);

  return (
    <html lang="de">
      <body className="min-h-screen bg-obs-black px-6 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-obs-card p-6 text-sm text-white/70">
          <p>Es ist ein unerwarteter Fehler aufgetreten.</p>
          <button
            className="mt-4 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold"
            onClick={() => reset()}
          >
            Seite neu laden
          </button>
        </div>
      </body>
    </html>
  );
}
