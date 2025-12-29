import {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../lib/db';
import {UserResponse} from '../chat/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse[]>,
) {
  if (req.method === 'GET') {
    const result = await pool.query('select name from users');
    const names: UserResponse[] = result.rows;
    res.status(200).json(names);
  }
}
