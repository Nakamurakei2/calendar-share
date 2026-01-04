import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import {Dispatch, SetStateAction} from 'react';
import {CalendarUIType} from './types';

type CalendarProps = {
  handleDateClick: (e: DateClickArg) => void;
  CalendarUITypes: CalendarUIType[];
  setSelectedDate: Dispatch<SetStateAction<string>>;
  calendarRef: FullCalendar | null;
};

export default function Calendar({
  handleDateClick,
  CalendarUITypes,
  setSelectedDate,
  calendarRef,
}: CalendarProps) {
  return (
    <>
      <FullCalendar
        locale="ja"
        ref={calendarRef}
        dayCellContent={arg => arg.dayNumberText.replace('日', '')}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={CalendarUITypes}
        dateClick={handleDateClick}
        selectable={true}
        select={info => {
          setSelectedDate(info.startStr);
        }}
        dayMaxEvents={3}
        height="calc(100vh - 200px)"
        // dayCellDidMount={info => console.log('info')}
        headerToolbar={false}
      />
    </>
  );
}
