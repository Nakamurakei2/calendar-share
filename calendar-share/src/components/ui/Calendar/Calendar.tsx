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
        headerToolbar={{
          left: '',
          center: 'prev title next',
          right: 'today',
        }}
        buttonText={{
          today: '今日',
          prev: '<',
          next: '>',
        }}
        selectable={true}
        select={info => {
          setSelectedDate(info.startStr);
        }}
        dayMaxEvents={3}
        height="calc(100vh - 200px)"
        // dayCellDidMount={info => console.log('info')}
      />
    </>
  );
}
