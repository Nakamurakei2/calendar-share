/**
 * 引数のuserIdを比較し昇順に連携
 */
export const generateRoomId = (userId1: number, userId2: number): string => {
  let result;
  if (userId1 > userId2) {
    result = String(userId2) + String(userId1);
  } else {
    result = String(userId1) + String(userId2);
  }

  return result;
};
