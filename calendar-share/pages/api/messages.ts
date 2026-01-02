import {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../lib/db';
import {MessageObj} from '../chat/types';

type MesssageQuery = {
  content: string;
  user_id: number;
  created_at: string;
};

type SuccessResponse = {
  status: 'success';
  message: string;
  messages: MessageObj[];
};

type ErrorResponse = {
  status: 'error';
  message: string;
};

export type ResponseData = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === 'GET') {
    const {id} = req.query;
    const roomId = id;
    // want my id
    if (id && id !== 'undefined') {
      const messageData = await pool.query<MesssageQuery>(
        'select content, user_id, created_at from messages where room_id = $1',
        [roomId],
      );
      const messageRows: MesssageQuery[] = messageData.rows;
      const messages: MessageObj[] = messageRows.map(message => {
        return {
          messages: message.content,
          userId: message.user_id,
          createdAt: message.created_at,
        };
      });

      return res
        .status(200)
        .json({
          status: 'success',
          message: 'fetched messages successfully!',
          messages: messages,
        });
    }
  } else {
    return res
      .status(400)
      .json({status: 'error', message: 'failed to fetch message'});
  }
}
