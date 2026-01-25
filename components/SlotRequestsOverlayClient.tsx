'use client';

import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export default function SlotRequestsOverlayClient({
  room
}: {
  room: string;
}) {
  const [queue, setQueue] = useState<string[]>([]);
  const socketUrl = useMemo(
    () => process.env.NEXT_PUBLIC_SOCKET_URL ?? window.location.origin,
    []
  );

  useEffect(() => {
    const socket = io(socketUrl, { path: '/socket' });
    socket.emit('join', room);
    socket.on('slot-requests:update', (payload) => {
      if (payload?.queue) {
        setQueue(payload.queue);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [room, socketUrl]);

  return (
    <div className="mt-6 space-y-2">
      <div className="text-4xl font-semibold">Queue: {queue.length}</div>
      <div className="text-2xl">Next: {queue[0] ?? '--'}</div>
    </div>
  );
}
