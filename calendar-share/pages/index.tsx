import styles from './styles/index.module.css';
import {GetServerSidePropsContext} from 'next';
import jwt from 'jsonwebtoken';
import {createContext, useState} from 'react';
import {Client} from 'pg';
import Modal, {ModalInfo} from '../src/components/ui/Modal/Modal';
import Calendar from '../src/components/ui/Calendar/Calendar';
import {convertDateToString} from '../src/utils/CalendarUtils';
import EventButtons from '../src/components/ui/eventButtons/EventButtons';
import {
  CalendarUIType,
  DAY_SHIFT,
  HOLIDAY,
  NIGHT_SHIFT,
} from '../src/components/ui/Calendar/types';
import {useCalendarActions} from '../src/hooks/useCalendarActions';
import {useFooterActions} from '../src/hooks/useFooterActions';
import Footer from '../src/components/ui/footer/Footer';
import {useRouter} from 'next/router';

const EVENT_COLORS = {
  [HOLIDAY]: {backgroundColor: '#10b981', borderColor: '#059669'},
  [DAY_SHIFT]: {backgroundColor: '#3b82f6', borderColor: '#2563eb'},
  [NIGHT_SHIFT]: {backgroundColor: '#8b5cf6', borderColor: '#7c3aed'},
} as const;

export const MyContext = createContext<ModalInfo>({
  type: HOLIDAY,
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
    const result = await client.query(
      'select id, title, description, start from calendars',
    );
    // 接続終了
    await client.end();

    const rows: CalendarUIType[] = result.rows.map(ev => {
      const d: Date = new Date(ev.start);
      const formattedDate: string = convertDateToString(d);
      return {...ev, start: formattedDate};
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
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  // 好ましくない実装
  const [email, setEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('email') ?? '';
    } else return '';
  });

  // UI描画用
  const [calendarData, setCalendarData] = useState<CalendarUIType[]>(
    JSON.parse(calendarProps.calendarProps).map((event: CalendarUIType) => {
      const colors = EVENT_COLORS[event.title as keyof typeof EVENT_COLORS];
      return {
        ...event,
        ...colors,
      };
    }),
  );
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    type: 'holiday',
    description: '',
    startDate: '',
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return convertDateToString(new Date());
  });

  // Calendar event actions
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

  // Footer btn actions
  const {onCalendarBtnClick, onChatBtnClick, onProfileBtnClick} =
    useFooterActions(router);

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

      <EventButtons
        onDayShiftBtnClick={onDayShiftBtnClick}
        onNightShiftBtnClick={onNightShiftBtnClick}
        onHolydayBtnClick={onHolidayBtnClick}
      />
      {/* 
      <button
        type="button"
        className={styles.addBtn}
        onClick={() => setShowModal(true)}
      >
        +
      </button> */}

      <Footer
        onCalendarBtnClick={onCalendarBtnClick}
        onChatBtnClick={onChatBtnClick}
        onProfileBtnClick={onProfileBtnClick}
      />
    </div>
  );
}
