'use client';

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="px-6 py-20">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center">
        <h1 className="text-2xl font-semibold text-white">
          Etwas ist schiefgelaufen
        </h1>
        <p className="mt-4 text-sm text-slate-300">
          {error.message || 'Bitte versuche es erneut.'}
        </p>
        <button
          className="mt-6 rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          onClick={() => reset()}
          type="button"
        >
          Neu laden
        </button>
      </div>
    </main>
  );
}
