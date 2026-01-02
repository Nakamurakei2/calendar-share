import {NextApiRequest, NextApiResponse} from 'next';
import nodemailer from 'nodemailer';
import {ResponseData} from '../../types/global';

type MailerRequestBody = {
  name: string;
  email: string;
  content: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method == 'POST') {
    const {name, email, content} = req.body as MailerRequestBody;
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT as string),
      secure: false, // use true for port 465, false to port 587
      auth: {
        user: process.env.MAIL_FROM, // メール送信元のGmailアカウント
        pass: process.env.MAIL_PASS, // Gmailのアプリパスワード
      },
    });

    // send Email using async/await
    (async () => {
      const info = await transporter.sendMail({
        from: email,
        to: process.env.MAIL_TO,
        subject: `問い合わせ from ${name}`,
        text: content, // Plain-text version of the message
        html: content, // HTML version of the message
      });

      if (info.accepted) {
        return res
          .status(200)
          .json({status: 'success', message: 'send message successfully!'});
      } else {
        return res
          .status(500)
          .json({status: 'error', message: 'failed to send'});
      }
    })();
  }
}
