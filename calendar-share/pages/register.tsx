import Link from 'next/link';
import styles from './styles/auth.module.css';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/router';
import {registerSchema, RegisterSchemaType} from '../types/resolver';

export default function RegisterPage() {
  const router = useRouter();
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
    if (res.ok) {
      // ログインページに遷移する
      router.push('/login');
    }
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
