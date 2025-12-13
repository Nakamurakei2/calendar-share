import {DateClickArg} from '@fullcalendar/interaction';
import {CalendarReqType, CalendarUIType} from '../components/ui/Calendar/types';
import {addOneDay, convertDateToString} from '../utils/CalendarUtils';
import {Dispatch, SetStateAction} from 'react';

const HOLIDAY = '休日';
const DAY_SHIFT = '日勤';
const NIGHT_SHIFT = '夜勤';

export const useCalendarActions = (
  email: string,
  selectedDate: string,
  setCalendarData: Dispatch<SetStateAction<CalendarUIType[]>>,
  setShowModal: Dispatch<SetStateAction<boolean>>,
  setSelectedDate: Dispatch<SetStateAction<string>>,
) => {
  // カレンダーセルクリック時処理
  const handleDateClick = async (e: DateClickArg) => {
    // console.log('calendar cell click', e);
  };

  // 日勤ボタンクリック時処理
  const onDayShiftBtnClick = () => {};

  // 夜勤ボタンクリック時処理
  const onNightShiftBtnClick = () => {};

  // 休日ボタンクリック時処理
  const onHolidayBtnClick = async (): Promise<void> => {
    const tempId: string = 'tmpId-' + Date.now();
    // 選択されているdateを取得→「休日」という情報を付与
    const postData: CalendarReqType = {
      type: HOLIDAY,
      description: '',
      startDate: selectedDate,
      email: email,
      id: tempId,
    };
    await handleAddDate(postData);

    // Dateに再度変換+プラス1する
    const addedDate: string = addOneDay(selectedDate);
    setSelectedDate(addedDate);
  };

  // カレンダー登録処理
  const handleAddDate = async (data: CalendarReqType): Promise<void> => {
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result: {data: CalendarUIType[]} = await res.json();
        const startDate: Date = new Date(result.data[0].start);
        const formattedStartDate: string = convertDateToString(startDate);
        const calendarData: CalendarUIType = result.data[0];
        const postData: CalendarUIType = {
          ...calendarData,
          start: formattedStartDate,
        };

        setCalendarData(prev => [...prev, postData]);
        setShowModal(false);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('error', e);
      } else {
        console.error('unexpected error', e);
      }
    }
  };

  return {
    handleDateClick,
    onDayShiftBtnClick,
    onNightShiftBtnClick,
    onHolidayBtnClick,
    handleAddDate,
  };
};
