// FullCalendar UI更新用の型&DBからのレスポンス型
export type CalendarUIType = {
  id: string;
  title: string;
  description: string;
  start: string;
  backgroundColor?: string;
  borderColor?: string;
  editable?: boolean;
};

// サーバーへ問い合わせるためのリクエスト型
export type CalendarReqType = {
  type: string;
  description: string;
  startDate: string;
  email: string;
  id: string;
};
