import styles from './styles/index.module.css';
import {GetServerSidePropsContext} from 'next';
import jwt from 'jsonwebtoken';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import {ChangeEvent, useEffect, useState} from 'react';

type AddEvent = {
  type: string;
  content: string;
  description: string;
  startDate: string;
  endDate: string;
  email: string;
};

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
  const currentDate = new Date().toLocaleDateString();

  const [selectValue, setSelectValue] = useState<string>('holiday');
  const [contentValue, setContentValue] = useState<string>('');
  const [contentDescription, setContentDescription] = useState<string>('');
  const [startTime, setStartTime] = useState<string>(currentDate);
  const [endTime, setEndTime] = useState<string>(currentDate);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('email') ?? '';
    } else return '';
  });

  const handleDateClick = (e: DateClickArg) => {
    console.log('date clicked', e);
  };
  // イベント登録処理
  const handleAddEvent = async () => {
    const data: AddEvent = {
      type: selectValue,
      content: contentValue,
      description: contentDescription,
      startDate: startTime,
      endDate: endTime,
      email: email,
    };
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // ダイアログを閉じる。
        setShowModal(false);
        // カレンダーを更新
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('error', e);
      }
    }
  };

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
              <select
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectValue(e.target.value)
                }
              >
                <option value="holiday">休暇</option>
                <option value="work">仕事</option>
                <option value="other">その他</option>
              </select>
            </label>

            <label>
              内容:
              <input
                type="text"
                placeholder="イベント名"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setContentValue(e.target.value)
                }
              />
            </label>

            <label>
              メモ:
              <textarea
                placeholder="詳細メモを入力"
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setContentDescription(e.target.value)
                }
              />
            </label>

            <label>
              開始日時:
              <input
                type="datetime-local"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setStartTime(e.target.value)
                }
                max="9999-12-31" // 年は4桁まで
              />
            </label>

            <label>
              終了日時:
              <input
                type="datetime-local"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEndTime(e.target.value)
                }
                max="9999-12-31" // 年は4桁まで
              />
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
