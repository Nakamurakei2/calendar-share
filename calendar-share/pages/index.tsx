import styles from './styles/index.module.css';
import {GetServerSidePropsContext} from 'next';
import jwt from 'jsonwebtoken';
import {createContext, useEffect, useState} from 'react';
import {Client} from 'pg';
import Modal, {ModalInfo} from '../src/components/ui/Modal/Modal';
import Calendar from '../src/components/ui/Calendar/Calendar';
import {convertDateToString} from '../src/utils/CalendarUtils';
import EventButtons from '../src/components/ui/eventButtons/EventButtons';
import {
  CalendarResType,
  CalendarUIType,
} from '../src/components/ui/Calendar/types';
import {useCalendarActions} from '../src/hooks/useCalendarActions';

export const MyContext = createContext<ModalInfo>({
  type: '休日',
  description: '',
  startDate: new Date().toLocaleDateString(),
});

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

    const rows: CalendarUIType[] = result.rows.map(ev => {
      const d: Date = new Date(ev.start);
      const jst: Date = new Date(d.getTime() + 9 * 60 * 60 * 1000);

      return {
        ...ev,
        start: jst.toISOString().split('T')[0],
      };
    });

    return {
      props: {
        calendarProps: JSON.stringify(rows),
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

export default function IndexPage(calendarProps: {calendarProps: string}) {
  const [showModal, setShowModal] = useState<boolean>(false);
  console.log(calendarProps);
  // 好ましくない実装
  const [email, setEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('email') ?? '';
    } else return '';
  });

  const [calendarData, setCalendarData] = useState<CalendarUIType[]>(
    JSON.parse(calendarProps.calendarProps).map((ev: CalendarUIType) => ({
      ...ev,
      start: ev.start.split('T')[0],
    })),
  );
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    type: 'holiday',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return convertDateToString(new Date());
  });

  const {
    handleDateClick,
    onDayShiftBtnClick,
    onNightShiftBtnClick,
    onHolidayBtnClick,
    handleAddDate,
  } = useCalendarActions(
    email,
    selectedDate,
    setCalendarData,
    setShowModal,
    setSelectedDate,
  );

  return (
    <div className={styles.main}>
      <Calendar
        handleDateClick={handleDateClick}
        CalendarUITypes={calendarData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {showModal && (
        <MyContext.Provider value={modalInfo}>
          <Modal
            onSubmit={handleAddDate}
            onCloseDialog={() => setShowModal(false)}
            email={email}
          />
        </MyContext.Provider>
      )}

      {/* イベント登録用ボタン */}
      <EventButtons
        onDayShiftBtnClick={onDayShiftBtnClick}
        onNightShiftBtnClick={onNightShiftBtnClick}
        onHolydayBtnClick={onHolidayBtnClick}
      />

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
