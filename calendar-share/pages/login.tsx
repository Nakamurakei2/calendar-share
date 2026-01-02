import Link from 'next/link';
import styles from './styles/auth.module.css';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {loginSchema, LoginShcemaType} from '../types/resolver';
import {NextRouter, useRouter} from 'next/router';
import {GetServerSidePropsContext} from 'next';
import jwt from 'jsonwebtoken';
import {ResponseData} from './api/login';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token: string | undefined = context.req.cookies?.token;

  if (token) {
    // JWTの検証
    jwt.verify(token, process.env.JWT_SECRET!);
    return {
      redirect: {destination: '/', permanent: false},
    };
  }

  return {
    props: {},
  };
}

export default function LoginPage() {
  const router: NextRouter = useRouter();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginShcemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginShcemaType): Promise<void> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!res.ok) {
        console.error('HTTP error', res.status);
        return;
      }
      const resData: ResponseData = await res.json();

      if (resData.status === 'success') {
        console.debug(resData.message);
        const email: string = data.email;
        localStorage.setItem('email', email);
        router.push('/');
      } else {
        console.error('login error', resData.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('error occered while login process', error.message);
      } else {
        console.error('unexpected error', error);
      }
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <button type="submit">ログイン</button>
      </form>

      <Link href="/register">
        <span>アカウントをお持ちでない方はこちら</span>
      </Link>
    </div>
  );
}
