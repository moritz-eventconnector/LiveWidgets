import http from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.SOCKET_SERVER_PORT ?? 3001);
const server = http.createServer();
const io = new Server(server, {
  path: '/socket',
  cors: {
    origin: '*'
  }
});

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST ?? 'redis',
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD
    });

const subscriber = redis.duplicate();

io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);
  });
});

subscriber.subscribe('livewidgets:realtime');
subscriber.on('message', (_channel, message) => {
  try {
    const payload = JSON.parse(message);
    if (payload?.room && payload?.event) {
      io.to(payload.room).emit(payload.event, payload.payload);
    }
  } catch (error) {
    console.error('Realtime message error', error);
  }
});

server.listen(port, () => {
  console.log(`Realtime server listening on ${port}`);
});
