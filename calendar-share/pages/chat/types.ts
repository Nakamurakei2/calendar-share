export type UserResponse = {
  id: number;
  name: string;
};

export type MessageObj = {
  messages: string;
  userId: number; // メッセージを送信したuser ID
  createdAt: string;
};
