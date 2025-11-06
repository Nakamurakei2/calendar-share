import styles from './styles/index.module.css'
import { GetServerSidePropsContext } from 'next';
import jwt from "jsonwebtoken";

/**
 * useEffectではなくSSRで実行することで、一瞬のログイン前のページの表示を防ぐことができ、
 * SSRによってサーバー側で実行されるため、ページのHTMLを返す前に認証チェックができるので未認証ユーザーはそもそもページを閲覧できなくなる
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token: string | undefined = context.req.headers.cookie;
  if(!token) {
    return {
      // tokenがない場合
      redirect: {destination: '/login', permanent: false},
    }
  }

  try {
    // JWTの検証
    jwt.verify(token, process.env.JWT_SECRET!);
    return {
      props: {}, // 認証成功
    };
  } catch(err: unknown) {
    console.error('err', err);
    return {
      redirect: {destination: '/login', permanent: false},
    }
  }
}

export default function IndexPage() {

  return(
    <div className={styles.main}>
      index page
    </div>
  )
}