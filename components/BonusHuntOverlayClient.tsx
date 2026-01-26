'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function BonusHuntOverlayClient({
  room
}: {
  room: string;
}) {
  const [total, setTotal] = useState('0€');
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

  useEffect(() => {
    const resolvedSocketUrl = socketUrl ?? window.location.origin;
    const socket = io(resolvedSocketUrl, { path: '/socket' });
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
