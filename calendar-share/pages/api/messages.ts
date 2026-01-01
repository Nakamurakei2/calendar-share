import {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../lib/db';
import {MessageObj} from '../chat/types';

type ResponseData = {
  messages: MessageObj[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === 'GET') {
    const {id} = req.query;
    const roomId = id;
    // want my id
    if (id && id !== 'undefined') {
      const messageData = await pool.query(
        'select content, user_id, created_at from messages where room_id = $1',
        [roomId],
      );
      const messageRows = messageData.rows;
      const messages: MessageObj[] = messageRows.map(message => {
        return {
          messages: message.content,
          userId: message.user_id,
          createdAt: message.created_at,
        };
      });

      return res.status(200).json({messages: messages});
    }
  } else {
    return res.status(400).json({messages: []});
  }
}
