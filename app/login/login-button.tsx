'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function LoginButton() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const callbackUrl = searchParams?.get('callbackUrl') ?? '/';

  const handleClick = () => {
    startTransition(() => {
      void signIn('authentik', { callbackUrl });
    });
  };

  return (
    <button
      className="block w-full rounded-full border border-indigo-400/60 bg-indigo-500/20 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-indigo-300 hover:bg-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-70"
      onClick={handleClick}
      type="button"
      disabled={isPending}
    >
      {isPending ? 'Weiterleitung…' : 'Mit Authentik anmelden'}
    </button>
  );
}
