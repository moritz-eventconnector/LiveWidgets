'use client';

import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export default function BonusHuntOverlayClient({
  room
}: {
  room: string;
}) {
  const [total, setTotal] = useState('0€');
  const socketUrl = useMemo(
    () => process.env.NEXT_PUBLIC_SOCKET_URL ?? window.location.origin,
    []
  );

  useEffect(() => {
    const socket = io(socketUrl, { path: '/socket' });
    socket.emit('join', room);
    socket.on('bonus-hunt:update', (payload) => {
      if (payload?.totalWin) {
        setTotal(payload.totalWin);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [room, socketUrl]);

  return <div className="mt-6 text-5xl font-semibold">Gesamtgewinn: {total}</div>;
}
