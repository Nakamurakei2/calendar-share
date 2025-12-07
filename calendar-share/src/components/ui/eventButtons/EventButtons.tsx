import styles from './EventButtons.module.css';

export default function EventButtons() {
  return (
    <div className={styles.eventBUttonWrapper}>
      <button>日勤</button>
      <button>夜勤</button>
      <button>休み</button>
    </div>
  );
}
