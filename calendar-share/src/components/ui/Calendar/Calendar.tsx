import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';

type CalendarProps = {
  handleDateClick: (e: DateClickArg) => void;
  calendarEvents: CalendarEvent[];
};

type CalendarEvent = {
  id: number;
  title: string;
  description: string;
  start: string;
  backgroundColor?: string;
  borderColor?: string;
  editable?: boolean;
};


export default function Calendar({handleDateClick, calendarEvents}: CalendarProps) {
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
        selectable={true}
        select={(info) => {
          console.log('info.startstr', info.startStr)
        }}
      />
    </>
  );
}
