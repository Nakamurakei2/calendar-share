import styles from './styles/index.module.css';
import {GetServerSidePropsContext} from 'next';
import jwt from 'jsonwebtoken';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import {useState} from 'react';

/**
 * useEffectではなくSSRで実行することで、一瞬のログイン前のページの表示を防ぐことができ、
 * SSRによってサーバー側で実行されるため、ページのHTMLを返す前に認証チェックができるので未認証ユーザーはそもそもページを閲覧できなくなる
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token: string | undefined = context.req.cookies?.token;
  if (!token) {
    return {
      // tokenがない場合
      redirect: {destination: '/login', permanent: false},
    };
  }

  try {
    // JWTの検証
    jwt.verify(token, process.env.JWT_SECRET!);
    return {
      props: {}, // 認証成功
    };
  } catch (err: unknown) {
    console.error('err', err);
    return {
      redirect: {destination: '/login', permanent: false},
    };
  }
}

export default function IndexPage() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleDateClick = (e: DateClickArg) => {
    console.log('date clicked', e);
  };

  const handleAddEvent = () => {};

  return (
    <div className={styles.main}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[{title: 'event 1', date: '2025-11-01'}]}
        dateClick={handleDateClick}
      />

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>イベント追加</h2>

            <label>
              イベント種類:
              <select>
                <option value="holiday">休暇</option>
                <option value="work">仕事</option>
                <option value="other">その他</option>
              </select>
            </label>

            <label>
              内容:
              <input type="text" placeholder="イベント名" />
            </label>

            <label>
              メモ:
              <textarea placeholder="詳細メモを入力" />
            </label>

            <div className={styles.modalActions}>
              <button type="button" onClick={handleAddEvent}>
                追加
              </button>
              <button type="button" onClick={() => setShowModal(false)}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.addBtn}
        onClick={() => setShowModal(true)}
      >
        +
      </button>
    </div>
  );
}
