import {useEffect, useRef, useState} from 'react';

export const useWebSocket = (url: string, id: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const URL = `${url}?roomId=${id}`;
    const ws = new WebSocket(URL);
    wsRef.current = ws;

    // 成功時に送信(debug)
    ws.addEventListener('open', () => {
      console.log('websocket successfully connected!!');
      // ws.send('websocket successfully connected!');
    });

    // recieve message
    ws.addEventListener('message', (event: MessageEvent) => {
      console.log('message from server', event.data);
      setMessages(prev => [...prev, event.data]);
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
  }, [url, id]);

  const sendMessage = (msg: string): void => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    } else {
      console.warn('websocket is not open');
      // TODO: reconnect??
    }
  };

  return {messages, sendMessage};
};
