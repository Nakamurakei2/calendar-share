import {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../lib/db';
import jwt from 'jsonwebtoken';

export type ResponseData = {
  isSamePerson?: boolean;
  error?: string | Error;
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
    const partnerId: number = userData.rows[0]?.id;

    const token: string | undefined = req.cookies.token;
    if (!token) return res.status(400).json({error: 'token not found'}); // 適当

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
      const userId: number = decoded.userId;
      if (partnerId === userId) {
        return res.status(200).json({isSamePerson: true});
      } else {
        return res.status(200).json({isSamePerson: false});
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({error: error});
      } else {
        return res.status(500).json({error: 'unexpected error'});
      }
    }
  }
}
