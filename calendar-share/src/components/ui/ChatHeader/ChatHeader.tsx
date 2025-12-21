import {useRouter} from 'next/router';
import styles from './ChatHeader.module.css';

export default function ChatHeader() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back(); // using browser history to go back
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className={styles.chatHeader}>
      <p className={styles.leftArrow} onClick={handleBack}>
        ←
      </p>

      <p className={styles.username}>名前</p>
    </div>
  );
}
