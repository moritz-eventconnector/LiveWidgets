import { Suspense } from 'react';

import BonusHuntOverlayClient from './BonusHuntOverlayClient';

export default function BonusHuntOverlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <BonusHuntOverlayClient />
    </Suspense>
  );
}
