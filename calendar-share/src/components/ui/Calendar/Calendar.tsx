import styles from './Calendar.module.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';

type CalendarProps = {
  handleDateClick: (e: DateClickArg) => void;
};

type CalendarEvent = {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor?: string;
  editable: boolean;
};

const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Qiita書く',
    description: 'リンクアンドモチベーションのアドベントカレンダーを書く',
    start: '2025-11-15',
    end: '2022-12-16',
    backgroundColor: 'green',
    editable: true,
  },
  {
    id: 2,
    title: 'Qiita投稿',
    description: 'リンクアンドモチベーションのアドベントカレンダーを投稿する',
    start: '2025-11-18',
    end: '2022-12-18',
    backgroundColor: 'green',
    editable: false,
  },
];

export default function Calendar({handleDateClick}: CalendarProps) {
  return (
    <>
      <FullCalendar
        locale="ja"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        dateClick={handleDateClick}
        buttonText={{
          prev: '<',
          next: '>',
          prevYear: '<<',
          nextYear: '>>',
          today: '今日',
          month: 'カレンダー',
          week: '週',
          day: '日',
          listMonth: '今月のToDo',
          listDay: '今日のToDo',
        }}
        footerToolbar={{
          right: 'prev,next',
        }}
      />
    </>
  );
}
