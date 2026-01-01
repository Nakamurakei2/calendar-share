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
    if (id && id !== 'undefined') {
      const currentUserData = await pool.query(
        'select id from users where name = $1',
        [id],
      );
      const currentUserId: number = currentUserData.rows[0]?.id;
      console.log('currentUserId', currentUserId);
      if (currentUserId) {
        const messageData = await pool.query(
          'select content, user_id, created_at from messages',
        );
        const messageRows = messageData.rows;
        // 特定のユーザーのメッセージしか返してない？？？
        const messages = messageRows.map(message => {
          return {
            messages: message.content,
            userId: message.user_id,
            createdAt: message.created_at,
          };
        });

        return res.status(200).json({messages: messages});
      } else {
        return res.status(404).json({messages: []});
      }
    } else {
      return res.status(400).json({messages: []});
    }
  }
}
