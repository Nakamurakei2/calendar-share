import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import {Dispatch, SetStateAction} from 'react';
import {CalendarEvent} from './types';

type CalendarProps = {
  handleDateClick: (e: DateClickArg) => void;
  calendarEvents: CalendarEvent[];
  selectedDate: string;
  setSelectedDate: Dispatch<SetStateAction<string>>;
};

export default function Calendar({
  handleDateClick,
  calendarEvents,
  selectedDate,
  setSelectedDate,
}: CalendarProps) {
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
        select={info => {
          setSelectedDate(info.startStr);
        }}
        // dayCellDidMount={info => console.log('info')}
      />
    </>
  );
}
