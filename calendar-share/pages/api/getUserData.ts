import {NextApiRequest, NextApiResponse} from 'next';
import {ResponseData} from '../../types/global';
import jwt from 'jsonwebtoken';
import pool from '../../lib/db';

const SECRET = process.env.JWT_SECRET as string;

export type UserDataResponse = {
  username?: string;
} & ResponseData;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDataResponse>,
) {
  if (req.method === 'GET') {
    const token: string | undefined = req.cookies.token;
    if (!token) {
      return res.status(401).json({status: 'error', message: 'invalid token'});
    }

    let userId: number;
    try {
      const decoded = jwt.verify(token, SECRET) as {userId: number};
      userId = decoded.userId;
    } catch {
      return res.status(401).json({status: 'error', message: 'unauthorized'});
    }

    const result = await pool.query('select name from users where id=$1', [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(500)
        .json({status: 'error', message: 'failed to get user data'});
    }

    return res.status(200).json({
      status: 'success',
      message: 'fetched user data successfully!',
      username: result.rows[0].name,
    });
  }
}
