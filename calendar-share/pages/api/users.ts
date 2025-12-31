import {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../lib/db';
import {UserResponse} from '../chat/types';
import jwt from 'jsonwebtoken';

type ResponseData = {
  message: string;
};

/**
 * ログイン中のユーザー以外を返す
 * @returns ユーザ名の配列
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse[] | ResponseData>,
) {
  if (req.method === 'GET') {
    const token: string | undefined = req.cookies.token;
    if (!token) return res.status(400).json({message: 'failed'}); // 適当

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    const userId: number = decoded.userId;

    const result = await pool.query('select name from users where id != $1', [
      userId,
    ]);
    const names: UserResponse[] = result.rows;
    res.status(200).json(names);
  }
}
