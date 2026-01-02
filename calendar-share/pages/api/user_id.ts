import {NextApiRequest, NextApiResponse} from 'next';
import jwt from 'jsonwebtoken';

type SuccessResponse = {
  status: 'success';
  currentUserId?: number;
  message: string;
};

type ErrorResponse = {
  status: 'error';
  message: string;
};

export type UserIdResponseData = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserIdResponseData>,
) {
  const token: string | undefined = req.cookies.token;
  if (!token)
    return res.status(500).json({status: 'error', message: 'not authorized'});

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
  };
  const currentUserId: number = decoded.userId;

  if (currentUserId) {
    return res.status(200).json({
      status: 'success',
      currentUserId: currentUserId,
      message: 'fetched userIds successfully!',
    }); // statuscode適当
  }
}
