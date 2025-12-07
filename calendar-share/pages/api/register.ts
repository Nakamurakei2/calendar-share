import pool from '../../lib/db';
import {NextApiRequest, NextApiResponse} from 'next';
import bcrypt from 'bcrypt';

type ResponseData = {
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    created_at: Date;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const saltRounds = 10;
  const {name, email, password} = req.body;
  // postgreにユーザーデータを登録
  if (req.method === 'POST') {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword],
      );
      if (result.rows.length > 0) {
        return res
          .status(201)
          .json({message: 'Registered successfully', data: result.rows[0]});
      } else {
        return res.status(500).json({message: 'Failed to register user'});
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('error', error);
        return res.status(500).json({message: error.message});
      }
      console.error('unexpected error', error);
      return res.status(500).json({message: 'Unexpected error'});
    }
  }
}
