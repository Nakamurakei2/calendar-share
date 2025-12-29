import {useState} from 'react';
import {useWebSocket} from './useWebSocket';

export const useMessageActions = (url: string, id: string) => {
  const [input, setInput] = useState<string>('');
  const {sendMessage} = useWebSocket(url, id);

  // 送信ボタンクリック時処理
  const onMessageSend = (): void => {
    sendMessage(input);
    setInput('');
  };

  return {onMessageSend, input, setInput};
};
