import {NextRouter, useRouter} from 'next/router';
import styles from './ChatHeader.module.css';

type Props = {
  name: string;
};

export default function ChatHeader({name}: Props) {
  const router: NextRouter = useRouter();

  const handleBack = (): void => {
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

      <p className={styles.username}>{name}</p>
    </div>
  );
}
