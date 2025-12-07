import z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, {message: '名前を入力してください'})
    .regex(
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      {message: 'メールアドレスの形式が正しくありません'},
    ),
  password: z.string().min(1, {message: 'パスワードを入力してください'}),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, {message: '名前を入力してください'}),
    email: z
      .string()
      .min(1, {message: 'メールアドレスを入力してください'})
      .regex(
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        {message: 'メールアドレスの形式が正しくありません'},
      ),
    password: z.string().min(1, {message: 'パスワードを入力してください'}),
    confirmPassword: z
      .string()
      .min(1, {message: '確認用パスワードを入力してください'}),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

export type LoginShcemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
