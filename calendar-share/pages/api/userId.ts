import {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../lib/db';

export type ResponseData = {
  partnerId: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === 'GET') {
    const {id} = req.query;
    const userData = await pool.query('select id from users where name = $1', [
      id,
    ]);
    const partnerId: number | undefined = userData.rows[0]?.id;
    if (partnerId) return res.status(200).json({partnerId: partnerId});
  }
}
