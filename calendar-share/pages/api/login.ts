import {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {serialize} from 'cookie';

type LoginRequestBody = {
  email: string;
  password: string;
};

type SuccessResponse = {
  status: 'success';
  message: string;
};

type ErrorResponse = {
  status: 'error';
  message: string;
};

export type ResponseData = SuccessResponse | ErrorResponse;

type UserRow = {
  id: number;
  email: string;
  password: string;
};

const SECRET: string | undefined = process.env.JWT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const {email, password} = req.body as LoginRequestBody;

  if (req.method === 'POST') {
    // postgreにアクセス
    const result = await pool.query<UserRow>(
      'select id, email, password from users where email = $1',
      [email],
    );
    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: '該当のユーザーは見つかりませんでした',
      });
    } else {
      // パスワードの照合が一致しない場合
      const compared: boolean = await bcrypt.compare(
        password,
        result.rows[0].password,
      );
      if (!compared) {
        return res
          .status(401)
          .json({status: 'error', message: 'パスワードが一致しません'});
      } else {
        // パスワードの照合に成功した場合
        if (SECRET) {
          const token: string = jwt.sign({userId: result.rows[0].id}, SECRET, {
            expiresIn: '1y',
          });
          const cookie: string = serialize('token', token, {
            httpOnly: true, // JSからアクセス不可にする
            // secure: process.env.NODE_ENV === "production", // HTTPS時のみ送信
            sameSite: 'strict', // CSRF対策
            path: '/', // どのURLでも送信
            maxAge: 60 * 60 * 24 * 365, // 有効期限（1年）
          });

          res.setHeader('Set-Cookie', cookie); // Cookieにjwtの認証情報付きデータが自動で保存
          return res
            .status(200)
            .json({status: 'success', message: 'ログインに成功しました'});
        } else {
          return res
            .status(403)
            .json({status: 'error', message: '権限がありません'});
        }
      }
    }
  }
}
