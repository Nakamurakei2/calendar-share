import styles from './styles/index.module.css';
import {GetServerSidePropsContext} from 'next';
import jwt from 'jsonwebtoken';
import {createContext, useEffect, useState} from 'react';
import {Client} from 'pg';
import Modal from '../src/components/ui/Modal/Modal';
import Calendar from '../src/components/ui/Calendar/Calendar';
import {DateClickArg} from '@fullcalendar/interaction/index.js';
import {convertDateToString} from '../src/utils/CalendarUtils';
import EventButtons from '../src/components/ui/eventButtons/EventButtons';

export type AddEvent = {
  type: string;
  content: string;
  description: string;
  startDate: string;
  endDate: string;
  email: string;
};

type ModalInfo = {
  type: string;
  content: string;
  description: string;
  startDate: string;
  endDate: string;
};

export const MyContext = createContext<ModalInfo>({
  type: 'holiday',
  content: '',
  description: '',
  startDate: new Date().toLocaleDateString(),
  endDate: new Date().toLocaleDateString(),
});

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
    jwt.verify(token, process.env.JWT_SECRET!); // TODO
    // DBクライアント作成
    const client = new Client({
      // Clientで手動接続
      connectionString: process.env.DATABASE_URL,
    });

    // 接続
    await client.connect();
    // クエリ実行
    const result = await client.query('select * from calendars');
    // 接続終了
    await client.end();

    return {
      props: {
        calendarProps: JSON.stringify(result.rows),
      },
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('error occured', err);
    } else {
      console.error('unexpected error', err);
    }
    return {
      redirect: {destination: '/login', permanent: false},
    };
  }
}

export default function IndexPage(calendarProps: any) {
  const [calendarData, setCalendarData] = useState<ModalInfo[]>(JSON.parse(calendarProps.calendarProps)); // calendar情報格納
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    type: 'holiday',
    content: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [showModal, setShowModal] = useState<boolean>(false); // Modal開閉情報


  // イベント登録処理
  const handleAddEvent = async (data: AddEvent) => {
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setCalendarData(prev => [...prev, data]);
      if (res.ok) {
        setShowModal(false);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('error', e);
      }
    }
  };

  /**
   * カレンダーセルクリック時処理
   */
  const handleDateClick = async (e: DateClickArg) => {
    const date: string = convertDateToString(e.date);
    setModalInfo(prev => ({
      ...prev,
      startDate: date,
      endDate: date,
    }));
    setShowModal(true);
  };

  return (
    <div className={styles.main}>
      <Calendar handleDateClick={handleDateClick} calendarEvents={calendarData} />

      {showModal && (
        <MyContext.Provider value={modalInfo}>
          <Modal
            onSubmit={handleAddEvent}
            onCloseDialog={() => setShowModal(false)}
          />
        </MyContext.Provider>
      )}

      {/* イベント種別 */}
      <EventButtons />

      <button
        type="button"
        className={styles.addBtn}
        onClick={() => {
          setShowModal(true);
        }}
      >
        +
      </button>
    </div>
  );
}
