import ChatFooter from '../../src/components/ui/ChatFooter/ChatFooter';
import styles from './styles.module.css';
import {NextRouter, useRouter} from 'next/router';
import {useMessageActions} from '../../src/hooks/useMessageActions';
import {useWebSocket} from '../../src/hooks/useWebSocket';
import ChatHeader from '../../src/components/ui/ChatHeader/ChatHeader';
import {useEffect, useRef, useState} from 'react';
import {convertDateTimeToString} from '../../src/utils/CalendarUtils';
import {MessageObj} from './types';
import {generateRoomId} from '../../src/utils/generateRoomIdUtils';
import {ResponseData} from '../api/messages';
import {UserIdResponseData} from '../api/user_id';

export const WEBSOCKET_URL = 'ws://localhost:8080';

export default function ChatPage() {
  const [roomId, setRoomId] = useState<number>(0);
  const [currentUserId, setCurrentUserId] = useState<number>();
  const router: NextRouter = useRouter();
  const {id, name} = router.query;
  const {input, setInput, onMessageSend} = useMessageActions(
    WEBSOCKET_URL,
    roomId,
  );

  const {messages, setMessages} = useWebSocket(WEBSOCKET_URL, roomId);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // fetch message
    const fetchMessages = async (): Promise<void> => {
      const res = await fetch(`/api/messages?id=${roomId}`, {
        method: 'GET',
      });
      if (!res.ok) {
        console.error('HTTP error', res.status);
        return;
      }

      const resData: ResponseData = await res.json();
      if (resData.status === 'success') {
        console.debug(resData.message);
        const messages: MessageObj[] = resData.messages;
        setMessages(messages);
      } else {
        console.error(resData.message);
      }
    };
    fetchMessages();
  }, [roomId, setMessages]);

  useEffect(() => {
    if (bottomRef) bottomRef.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    const fetchUserId = async () => {
      const res = await fetch(`/api/user_id`);
      if (!res.ok) {
        console.error('HTTP error', res.status);
        return;
      }

      const resData: UserIdResponseData = await res.json();
      if (resData.status === 'success') {
        const currentUserId: number | undefined = resData.currentUserId;
        setCurrentUserId(currentUserId);
        if (currentUserId) {
          const unionIds: string = generateRoomId(currentUserId, Number(id));
          setRoomId(Number(unionIds));
        }
      }
    };
    fetchUserId();
  }, [id]);

  return (
    <div className={styles.chatRoomWrapper}>
      <ChatHeader name={name as string} />

      {messages.map((message, id) => (
        <div key={id}>
          <p
            className={`${styles.chatMessage} 
            ${currentUserId === message.userId ? styles.mine : styles.theirs}`}
          >
            {message.messages}
          </p>
          <span
            className={
              currentUserId === message.userId
                ? styles.myMessageDate
                : styles.theirMessageDate
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
