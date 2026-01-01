import {NextApiRequest, NextApiResponse} from 'next';
import jwt from 'jsonwebtoken';

export type ResponseData = {
  message: string;
  currentUserId?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  // 現在ログイン中のuser_idをがっちゃんこしたnumber型をroom_idとして返したい
  const token = req.cookies.token;
  if (!token) return res.status(500).json({message: 'not authorized'});

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
  };
  const currentUserId: number = decoded.userId;

  if (currentUserId) {
    return res.status(200).json({
      currentUserId: currentUserId,
      message: 'Get userIds successfully!',
    }); // statuscode適当
  }
}
