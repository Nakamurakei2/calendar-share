import ChatFooter from '../../src/components/ui/ChatFooter/ChatFooter';
import styles from './styles.module.css';
import {useRouter} from 'next/router';
import {useMessageActions} from '../../src/hooks/useMessageActions';
import {useEffect} from 'react';

export default function ChatPage() {
  const isMine = true;
  const router = useRouter();
  const {id} = router.query;
  const {onMessageSend} = useMessageActions();

  useEffect(() => {
    // websocket通信開始
    const ws = new WebSocket(`ws://localhost:8080?roomId=${id}`);

    // 接続成功時
    ws.addEventListener('open', () => {
      console.log('websocket 接続完了');
      ws.send('hello server!!!');
    });

    // メッセージ待ち受け
    ws.addEventListener('message', (event: MessageEvent) => {
      console.log('message from server', event.data);
    });

    // エラー発生時のイベント
    ws.addEventListener('error', event => {
      console.log('websocket error', event);
    });

    // 接続終了イベント
    ws.addEventListener('close', () => {
      console.log('websocket接続終了');
    });

    return () => {
      // clean up
      ws.close();
    };
  }, [id]);

  return (
    <div className={styles.chatRoomWrapper}>
      chat room {id}
      <p
        className={`${styles.chatMessage} ${isMine ? styles.mine : styles.theirs}`}
      ></p>
      <ChatFooter onMessageSend={onMessageSend} />
    </div>
  );
}
