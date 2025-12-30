import {Dispatch, SetStateAction, useEffect} from 'react';
import styles from './ChatFooter.module.css';

type ChatFooterProps = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  onMessageSend: () => void;
};

export default function ChatFooter({
  input,
  setInput,
  onMessageSend,
}: ChatFooterProps) {
  return (
    <div className={styles.chatFooterWrapper}>
      <input
        type="text"
        className={styles.chatInput}
        placeholder="input any message"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        className={input ? styles.submitButton : styles.disableSubmitBtn}
        onClick={onMessageSend}
      >
        送信
      </button>
    </div>
  );
}
