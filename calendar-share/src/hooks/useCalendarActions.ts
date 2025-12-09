import {DateClickArg} from '@fullcalendar/interaction';
import {
  AddDateRequestType,
  CalendarEvent,
} from '../components/ui/Calendar/types';
import {addOneDay} from '../utils/CalendarUtils';
import {Dispatch, SetStateAction} from 'react';

export const useCalendarActions = (
  email: string,
  selectedDate: string,
  setCalendarData: Dispatch<SetStateAction<CalendarEvent[]>>,
  setShowModal: Dispatch<SetStateAction<boolean>>,
  setSelectedDate: Dispatch<SetStateAction<string>>,
) => {
  // カレンダーセルクリック時処理
  const handleDateClick = async (e: DateClickArg) => {
    console.log('calendar cell click', e);
  };

  // 日勤ボタンクリック時処理
  const onDayShiftBtnClick = () => {};

  // 夜勤ボタンクリック時処理
  const onNightShiftBtnClick = () => {};

  // 休日ボタンクリック時処理
  const onHolidayBtnClick = (): void => {
    // 選択されているdateを取得→「休日」という情報を付与
    const postData: AddDateRequestType = {
      type: '休日',
      description: '',
      startDate: selectedDate,
      email: email,
    };
    handleAddDate(postData);

    const newEvent = {
      id: Date.now().toLocaleString(),
      title: '休日',
      description: '',
      start: selectedDate,
    };

    setCalendarData(prev => [...prev, newEvent]); // UI更新

    // Dateに再度変換+プラス1する
    const addedDate: string = addOneDay(selectedDate);
    setSelectedDate(addedDate);
  };

  // カレンダー登録処理
  const handleAddDate = async (data: AddDateRequestType) => {
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setCalendarData(prev => [...prev, data]);
        setShowModal(false);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('error', e);
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
