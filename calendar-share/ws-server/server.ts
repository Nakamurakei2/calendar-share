import {config} from 'dotenv';
import {WebSocketServer} from 'ws';
import {parse} from 'url';
import {Pool} from 'pg';
import jwt from 'jsonwebtoken';

// .envファイルのパスを指定
config({path: '../.env'});

const SECRET: string | undefined = process.env.JWT_SECRET;
const pool: Pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, // 10秒
});
const wss = new WebSocketServer({port: 8080});

// roomId => Set<WebSocket>
const rooms = new Map();

wss.on('connection', async (ws, req) => {
  // Current logged in user's user_id
  const cookieHeader = req.headers.cookie;
  const token: string | null = parseTokenFromCookie(cookieHeader);
  if (!token) return;

  try {
    const decoded = jwt.verify(token, SECRET) as {userId: string};
    ws.userId = decoded.userId;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('decode error occured', error);
    } else {
      console.error('unexpected error', error);
    }
  }

  // const roomId = query.roomId as string; // TODO：roomIDは一意なものに変更する
  const roomId = 1922;

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
  ws.on('message', async data => {
    const message: string = data.toString();
    const messageDate = await pool.query(
      'insert into messages (room_id, user_id, content) values ($1, $2, $3) returning created_at',
      [roomId, ws.userId, message],
    );
    const createdAt: Date = messageDate.rows[0]?.created_at; // add type

    rooms.get(roomId).forEach(client => {
      console.log('send to client', {
        sender: ws.userId,
        target: client.userId,
        same: client === ws,
      });

      if (client.readyState === ws.OPEN) {
        client.send(
          JSON.stringify({
            messages: message,
            userId: ws.userId,
            createdAt: createdAt,
          }),
        );
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

const parseTokenFromCookie = (
  cookieHeader: string | undefined,
): string | null => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith('token='));
  if (!tokenCookie) return null;

  return tokenCookie.replace('token=', '');
};
