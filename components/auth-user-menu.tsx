'use client';

import { signOut } from 'next-auth/react';

type AuthUserMenuProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function AuthUserMenu({ name, email, image }: AuthUserMenuProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-800 text-sm font-semibold text-white">
          {image ? (
            <img
              src={image}
              alt={name ?? 'Profilbild'}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{name?.slice(0, 1)?.toUpperCase() ?? 'C'}</span>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">
            Angemeldet
          </p>
          <p className="text-sm font-semibold text-white">
            {name ?? 'Creator'}
          </p>
          <p className="text-xs text-slate-300">{email ?? 'Session aktiv'}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: '/login' })}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-indigo-400/60 hover:bg-white/10"
      >
        Logout
      </button>
    </div>
  );
}
