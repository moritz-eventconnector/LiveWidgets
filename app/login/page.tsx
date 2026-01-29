import { Suspense } from 'react';

import LoginButton from './login-button';

const highlights = [
  {
    title: 'Einfacher Einstieg',
    detail: 'Single-Domain Setup, damit Auth und Overlays direkt zusammenarbeiten.'
  },
  {
    title: 'Creator Fokus',
    detail: 'Baue dein Overlay-Stacking, bevor du den Stream live schaltest.'
  },
  {
    title: 'Realtime Ready',
    detail: 'Socket-Events laufen unter der gleichen Domain wie dein Dashboard.'
  }
];

type LoginPageProps = {
  searchParams?: {
    callbackUrl?: string;
    error?: string;
  };
};

const errorMessages: Record<string, string> = {
  OAuthSignin:
    'Der Authentik-Login konnte nicht gestartet werden. Prüfe die OIDC-Client-Daten.',
  OAuthCallback:
    'Authentik hat die Anmeldung abgebrochen oder die Callback-URL ist falsch.',
  OAuthAccountNotLinked:
    'Dieser Account ist bereits mit einem anderen Login verknüpft.',
  OAuthCreateAccount: 'Der Account konnte nicht erstellt werden.',
  EmailCreateAccount: 'Der Account konnte nicht erstellt werden.',
  EmailSignin: 'Die E-Mail-Anmeldung ist derzeit nicht verfügbar.',
  CredentialsSignin: 'E-Mail oder Passwort sind falsch.',
  SessionRequired: 'Bitte melde dich an, um fortzufahren.',
  Default: 'Beim Login ist ein unerwarteter Fehler aufgetreten.',
  authentik:
    'Authentik konnte nicht erreicht werden. Prüfe die Issuer-URL und Netzwerkfreigaben.'
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const errorKey = searchParams?.error;
  const errorMessage =
    (errorKey && errorMessages[errorKey]) || (errorKey && errorMessages.Default);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
            LiveWidgets Login
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Willkommen zurück, Creator.
          </h1>
          <p className="text-base text-slate-300">
            Der Login ist aktuell ein Platzhalter. Hier entsteht der Entry-Point
            für Creator, die direkt in ihr Dashboard springen.
          </p>
        </header>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-200">
              Login fehlgeschlagen
            </p>
            <p className="mt-2">{errorMessage}</p>
            <p className="mt-2 text-xs text-rose-200">
              Fehlercode: <span className="font-semibold">{errorKey}</span>
            </p>
          </div>
        ) : null}

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/40 p-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-white">Sign-In</h2>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                  Authentik Login
                </p>
                <p className="mt-2 text-sm">
                  Melde dich über deinen Authentik-Account an und starte direkt
                  im Creator-Dashboard.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                  Creator Zugang
                </p>
                <p className="mt-2 text-sm">
                  Weitere Login-Optionen folgen, sobald das neue Auth-Setup
                  komplett ist.
                </p>
              </div>
            </div>
            <Suspense
              fallback={
                <button
                  className="block w-full rounded-full border border-indigo-400/60 bg-indigo-500/20 px-6 py-3 text-center text-sm font-semibold text-white opacity-70"
                  type="button"
                  disabled
                >
                  Anmeldung wird geladen…
                </button>
              }
            >
              <LoginButton />
            </Suspense>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Was dich erwartet</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {highlights.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-300">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
