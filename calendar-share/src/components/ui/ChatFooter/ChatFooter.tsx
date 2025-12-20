import styles from './ChatFooter.module.css';

type ChatFooterProps = {
  onMessageSend: () => void;
};

export default function ChatFooter({onMessageSend}: ChatFooterProps) {
  return (
    <div className={styles.chatFooterWrapper}>
      <input
        type="text"
        className={styles.chatInput}
        placeholder="input any message"
      />
      <button className={styles.submitButton} onClick={onMessageSend}>
        送信
      </button>
    </div>
  );
}
