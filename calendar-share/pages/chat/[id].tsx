import ChatFooter from '../../src/components/ui/ChatFooter/ChatFooter';
import styles from './styles.module.css';
import {useRouter} from 'next/router';
import {useMessageActions} from '../../src/hooks/useMessageActions';
import {useWebSocket} from '../../src/hooks/useWebSocket';
import ChatHeader from '../../src/components/ui/ChatHeader/ChatHeader';

export const WEBSOCKET_URL = 'ws://localhost:8080';

export default function ChatPage() {
  const isMine = true; // TODO
  const router = useRouter();
  const {id} = router.query;
  const {input, setInput, onMessageSend} = useMessageActions(
    WEBSOCKET_URL,
    id as string,
  );

  const {messages} = useWebSocket(WEBSOCKET_URL, id as string);

  return (
    <div className={styles.chatRoomWrapper}>
      <ChatHeader />

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
