import {NextApiRequest, NextApiResponse} from 'next';
import {ResponseData} from '../../types/global';
import jwt from 'jsonwebtoken';
import pool from '../../lib/db';

const SECRET = process.env.JWT_SECRET as string;
type UpdateUsernameReqBody = {
  username: string;
};

export type UpdateUsernameResponse = {
  username?: string;
} & ResponseData;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateUsernameResponse>,
) {
  if (req.method === 'PATCH') {
    const {username} = req.body as UpdateUsernameReqBody;

    if (!username || typeof username !== 'string') {
      return res
        .status(400)
        .json({status: 'error', message: 'invalid username'});
    }

    const token: string | undefined = req.cookies.token;
    if (!token)
      return res.status(401).json({status: 'error', message: 'unauthorized'});

    let userId: number;
    try {
      const decoded = jwt.verify(token, SECRET) as {userId: number};
      userId = decoded.userId;
    } catch {
      return res.status(401).json({status: 'error', message: 'invalid token'});
    }

    const result = await pool.query(
      'update users set name = $1 where id = $2 returning name',
      [username, userId],
    );
    if (result.rows.length === 0) {
      return res
        .status(500)
        .json({status: 'error', message: 'failed to update username'});
    }
    const name: string = result.rows[0].name;

    return res.status(200).json({
      status: 'success',
      message: 'updated username successfully!!',
      username: name,
    });
  }
}
