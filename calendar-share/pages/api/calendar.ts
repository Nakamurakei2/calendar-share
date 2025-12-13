import {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../lib/db';
import {QueryResult} from 'pg';
import {CalendarUIType} from '../../src/components/ui/Calendar/types';

type ResponseType = {
  message: string;
  data?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method === 'POST') {
    try {
      const {type, description, startDate, email} = req.body;
      // DBにデータを登録
      const user = await pool.query('select id from users where email = $1', [
        email,
      ]);
      const currentUserId: string = user.rows[0].id;

      const result = await pool.query(
        'insert into calendars (user_id, title, description, start) values ($1, $2, $3, $4) returning id, title, description, start',
        [currentUserId, type, description, startDate],
      );

      if (result.rows.length > 0) {
        return res
          .status(201)
          .json({message: 'Event added successfully!', data: result.rows});
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
