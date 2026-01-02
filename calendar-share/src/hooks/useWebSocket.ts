import {useEffect, useRef, useState} from 'react';
import {MessageObj} from '../../pages/chat/types';

export const useWebSocket = (url: string, roomId: number) => {
  const [messages, setMessages] = useState<MessageObj[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const URL: string = `${url}?roomId=${roomId}`;
    const ws: WebSocket = new WebSocket(URL);
    wsRef.current = ws;

    // 成功時に送信(debug)
    ws.addEventListener('open', () => {
      console.log('websocket successfully connected!!');
      // websocketと接続できたときに、現在のログイン中のユーザーのIDとpartnerIdを連携させて渡す
    });

    // recieve message from server
    ws.addEventListener('message', event => {
      console.log('message from server', event.data);
      const parsedData: MessageObj = JSON.parse(event.data);
      setMessages(prev => [...prev, parsedData]);
    });

    // on error
    ws.addEventListener('error', event => {
      console.error('websocket error', event);
    });

    // close websocket connection
    ws.addEventListener('close', () => {
      console.log('close websocket connection');
    });

    return () => {
      ws.close();
    };
  }, [url, roomId]);

  // send Message func
  const sendMessage = (msg: string): void => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    } else {
      console.warn('websocket is not open');
      // TODO: reconnect??
    }
  };

  return {messages, setMessages, sendMessage};
};
