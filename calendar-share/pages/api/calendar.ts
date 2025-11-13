import {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../lib/db';

type ResponseType = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method === 'POST') {
    try {
      const {type, content, description, startDate, endDate, email} = req.body;
      // DBにデータを登録
      // 勉強のためあえて現在ログインしているユーザーのidをDBから取得した上で登録する
      const user = await pool.query('select id from users where email = $1', [
        email,
      ]);
      const currentUserId = user.rows[0].id;

      const result = await pool.query(
        'insert into calendars (user_id, type, content, description, start_time, end_time) values ($1, $2, $3, $4, $5, $6) returning *',
        [currentUserId, type, content, description, startDate, endDate],
      );

      if (result.rows.length > 0) {
        return res.status(201).json({message: 'Event added successfully!'});
      } else {
        return res.status(400).json({message: 'Failed to add event'});
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error', error);
      } else {
        console.error('Unexpected error', error);
      }
    }
  }
}
