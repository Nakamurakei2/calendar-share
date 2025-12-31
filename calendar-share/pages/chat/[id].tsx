import ChatFooter from '../../src/components/ui/ChatFooter/ChatFooter';
import styles from './styles.module.css';
import {NextRouter, useRouter} from 'next/router';
import {useMessageActions} from '../../src/hooks/useMessageActions';
import {useWebSocket} from '../../src/hooks/useWebSocket';
import ChatHeader from '../../src/components/ui/ChatHeader/ChatHeader';
import {useEffect, useRef, useState} from 'react';
import {convertDateTimeToString} from '../../src/utils/CalendarUtils';
import {MessageObj} from './types';

export const WEBSOCKET_URL = 'ws://localhost:8080';

export default function ChatPage() {
  const [myMessage, setMyMessage] = useState<boolean>(true);
  const router: NextRouter = useRouter();
  const {id} = router.query;
  const {input, setInput, onMessageSend} = useMessageActions(
    WEBSOCKET_URL,
    id as string,
  );

  const {messages, setMessages} = useWebSocket(WEBSOCKET_URL, id as string);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // fetch message
    const fetchMessages = async (): Promise<void> => {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        const messages: MessageObj[] = data.messages;
        setMessages(messages);
      }
    };

    fetchMessages();
  }, [id, setMessages]);

  useEffect(() => {
    if (bottomRef) bottomRef.current?.scrollIntoView();
  }, [messages]);

  console.log('messages', messages);

  return (
    <div className={styles.chatRoomWrapper}>
      <ChatHeader name={id as string} />

      {messages.map((message, id) => (
        <div key={id}>
          <p
            className={`${styles.chatMessage} ${myMessage ? styles.mine : styles.theirs}`}
          >
            {message.messages}
          </p>
          <span
            className={
              myMessage ? styles.myMessageDate : styles.theirMessageDate
            }
          >
            {convertDateTimeToString(new Date(message.createdAt))}
          </span>
        </div>
      ))}
      <div ref={bottomRef}></div>
      <ChatFooter
        input={input}
        setInput={setInput}
        onMessageSend={onMessageSend}
      />
    </div>
  );
}
