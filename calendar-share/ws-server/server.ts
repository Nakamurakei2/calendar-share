import {WebSocketServer} from 'ws';
import {parse} from 'url';
import {Pool} from 'pg';

const pool: Pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, // 10秒
});

const wss = new WebSocketServer({port: 8080});

// roomId => Set<WebSocket>
const rooms = new Map();

wss.on('connection', async (ws, req) => {
  const {query} = parse(req.url, true);
  const roomId = query.roomId as string; // TODO：roomIDは一意なものに変更する
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

  const userQuery = await pool.query('select id from users where name = $1', [
    roomId,
  ]);
  const userId: number = userQuery.rows[0]?.id;

  // message 受信
  ws.on('message', async data => {
    const message: string = data.toString();
    const messageDate = await pool.query(
      'insert into messages (user_id, content) values ($1, $2) returning created_at',
      [userId, message],
    );
    const createdAt = messageDate.rows[0]?.created_at;

    rooms.get(roomId).forEach(client => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({messages: message, createdAt: createdAt}));
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
