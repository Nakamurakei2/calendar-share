export const useMessageActions = () => {
  // 送信ボタンクリック時処理
  const onMessageSend = () => {
    console.log('message send btn clicked');
  };

  return {onMessageSend};
};
