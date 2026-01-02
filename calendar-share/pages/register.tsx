import Link from 'next/link';
import styles from './styles/auth.module.css';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {NextRouter, useRouter} from 'next/router';
import {registerSchema, RegisterSchemaType} from '../types/resolver';
import {GetServerSidePropsContext} from 'next';
import jwt from 'jsonwebtoken';
import {ResponseData} from '../types/global';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token: string | undefined = context.req.cookies?.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET!);
    return {
      redirect: {destination: '/', permanent: false},
    };
  }

  return {
    props: {},
  };
}

export default function RegisterPage() {
  const router: NextRouter = useRouter();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({resolver: zodResolver(registerSchema)});

  const onSubmit = async (data: RegisterSchemaType) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error('HTTP error', res.status);
      return;
    }
    const resData: ResponseData = await res.json();
    if (resData.status === 'success') router.push('/');
    else router.push('/register');
  };

  return (
    <div className={styles.registerWrapper}>
      <h1>新規登録</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputWrapper}>
          <label>名前</label>
          <input type="text" placeholder="山田太郎" {...register('name')} />
        </div>
        {errors.name && (
          <p className={styles.errorMessage}>{errors.name.message}</p>
        )}

        <div className={styles.inputWrapper}>
          <label>メールアドレス</label>
          <input
            type="text"
            placeholder="example@email.com"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className={styles.errorMessage}>{errors.email.message}</p>
        )}

        <div className={styles.inputWrapper}>
          <label>パスワード</label>
          <input
            type="password"
            placeholder="********"
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className={styles.errorMessage}>{errors.password.message}</p>
        )}

        <div className={styles.inputWrapper}>
          <label>パスワード（確認）</label>
          <input
            type="password"
            placeholder="********"
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p className={styles.errorMessage}>
            {errors.confirmPassword.message}
          </p>
        )}

        <button type="submit">登録</button>
      </form>
      <Link href="/login">
        <span>アカウントをお持ちでない方はこちら</span>
      </Link>
    </div>
  );
}
