// FullCalendar UI更新用の型
export type CalendarUIType = {
  id: number;
  title: string;
  description: string;
  start: string;
  backgroundColor?: string;
  borderColor?: string;
  editable?: boolean;
};

//DBにカレンダー情報を登録するための型
export type CalendarResType = {
  type: string;
  description: string;
  startDate: string;
  email: string;
  id: string;
};
