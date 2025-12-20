import {WebSocketServer} from 'ws';
import {parse} from 'url';

const wss = new WebSocketServer({port: 8080});

// roomId => Set<WebSocket>
const rooms = new Map();

wss.on('connection', (ws, req) => {
  const {query} = parse(req.url, true);
  const roomId = query.roomId as string;
  if (!roomId) {
    ws.close();
    return;
  }

  // room 初期化
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  rooms.get(roomId).add(ws);

  console.log(`connected to room ${roomId}`);

  // message 受信
  ws.on('message', data => {
    const message = data.toString();
    console.log(`message from client: ${message}`);

    // 同じ room に broadcast
    rooms.get(roomId).forEach(client => {
      if (client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  // close
  ws.on('close', () => {
    console.log(`disconnected from room ${roomId}`);
    rooms.get(roomId).delete(ws);

    if (rooms.get(roomId).size === 0) {
      rooms.delete(roomId);
    }
  });

  // error
  ws.on('error', err => {
    console.error('ws error', err);
  });
});

console.log('WebSocket server running on ws://localhost:8080');
