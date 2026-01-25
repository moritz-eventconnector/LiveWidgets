import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obs-black px-6 text-white">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-obs-card p-8">
        <div>
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="mt-2 text-sm text-white/70">
            Melde dich mit Twitch oder Email/Passwort an.
          </p>
        </div>
        <Link
          href="/api/auth/signin/twitch"
          className="block w-full rounded-full bg-obs-accent px-5 py-3 text-center text-sm font-semibold"
        >
          Mit Twitch anmelden
        </Link>
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70">Email</label>
            <input
              type="email"
              name="email"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Passwort</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full border border-white/20 px-5 py-3 text-sm font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
