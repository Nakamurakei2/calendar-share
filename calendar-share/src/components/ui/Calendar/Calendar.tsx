import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import {Dispatch, SetStateAction} from 'react';
import {CalendarUIType} from './types';

type CalendarProps = {
  handleDateClick: (e: DateClickArg) => void;
  CalendarUITypes: CalendarUIType[];
  selectedDate: string;
  setSelectedDate: Dispatch<SetStateAction<string>>;
};

export default function Calendar({
  handleDateClick,
  CalendarUITypes,
  selectedDate,
  setSelectedDate,
}: CalendarProps) {
  return (
    <>
      <FullCalendar
        locale="ja"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={CalendarUITypes}
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
