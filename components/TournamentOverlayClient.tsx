'use client';

import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export default function TournamentOverlayClient({ room }: { room: string }) {
  const [round, setRound] = useState('Round 1');
  const [match, setMatch] = useState('TBD');
  const socketUrl = useMemo(
    () => process.env.NEXT_PUBLIC_SOCKET_URL ?? window.location.origin,
    []
  );

  useEffect(() => {
    const socket = io(socketUrl, { path: '/socket' });
    socket.emit('join', room);
    socket.on('tournament:update', (payload) => {
      if (payload?.round) {
        setRound(payload.round);
      }
      if (payload?.match) {
        setMatch(payload.match);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [room, socketUrl]);

  return (
    <div className="mt-6 space-y-2">
      <div className="text-4xl font-semibold">{round}</div>
      <div className="text-2xl">Match: {match}</div>
    </div>
  );
}
