type SuccessResponse<T, U> = {
  status: 'success';
  message: string;
  currentUserId?: T;
  messages?: U;
};

type ErrorResponse = {
  status: 'error';
  message: string;
};

/**
 * @template T ログイン中のuserId
 * @template U チャット相手とのメッセージ情報全て
 */
export type ResponseData<T = undefined, U = undefined> =
  | SuccessResponse<T, U>
  | ErrorResponse;
