import ChatFooter from '../../src/components/ui/ChatFooter/ChatFooter';
import styles from './styles.module.css';
import {NextRouter, useRouter} from 'next/router';
import {useMessageActions} from '../../src/hooks/useMessageActions';
import {useWebSocket} from '../../src/hooks/useWebSocket';
import ChatHeader from '../../src/components/ui/ChatHeader/ChatHeader';
import {useEffect} from 'react';

export const WEBSOCKET_URL = 'ws://localhost:8080';

export default function ChatPage() {
  const isMine = true; // TODO
  const router: NextRouter = useRouter();
  const {id} = router.query;
  const {input, setInput, onMessageSend} = useMessageActions(
    WEBSOCKET_URL,
    id as string,
  );
  const {messages, setMessages} = useWebSocket(WEBSOCKET_URL, id as string);

  useEffect(() => {
    // fetch message
    const fetchMessages = async (): Promise<void> => {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        const messages: string[] = data.messages;
        setMessages(messages);
      }
    };

    fetchMessages();
  }, [id, setMessages]);

  return (
    <div className={styles.chatRoomWrapper}>
      <ChatHeader name={id as string} />

      {messages.map((message, id) => (
        <p
          key={id}
          className={`${styles.chatMessage} ${isMine ? styles.mine : styles.theirs}`}
        >
          {message}
        </p>
      ))}
      <ChatFooter
        input={input}
        setInput={setInput}
        onMessageSend={onMessageSend}
      />
    </div>
  );
}
