import pool from '../../lib/db';
import {NextApiRequest, NextApiResponse} from 'next';
import bcrypt from 'bcrypt';

type SuccessResponse = {
  status: 'success';
  message: string;
  data?: ResponseDataType;
};

type ErrorResponse = {
  status: 'error';
  message: string;
};

export type ResponseData = SuccessResponse | ErrorResponse;

type ResponseDataType = {
  data?: {
    id: number;
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    created_at: Date;
  };
};

type RegisterRequestBody = {
  name: string;
  email: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const saltRounds: number = 10;
  const {name, email, password} = req.body as RegisterRequestBody;
  // postgreにユーザーデータを登録
  if (req.method === 'POST') {
    try {
      const hashedPassword: string = await bcrypt.hash(password, saltRounds);
      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword],
      );

      if (result.rows.length > 0) {
        return res.status(201).json({
          status: 'success',
          message: 'Registered successfully',
          data: result.rows[0],
        });
      } else {
        return res
          .status(500)
          .json({status: 'error', message: 'Failed to register user'});
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({status: 'error', message: error.message});
      }
      return res
        .status(500)
        .json({status: 'success', message: 'Unexpected error'});
    }
  }
}
