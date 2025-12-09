import styles from './EventButtons.module.css';

type EventProps = {
  onDayShiftBtnClick: () => void;
  onNightShiftBtnClick: () => void;
  onHolydayBtnClick: () => void;
};

export default function EventButtons({
  onDayShiftBtnClick,
  onNightShiftBtnClick,
  onHolydayBtnClick,
}: EventProps) {
  return (
    <div className={styles.eventButtonWrapper}>
      <button className={styles.dayShift} onClick={onDayShiftBtnClick}>
        日勤
      </button>
      <button className={styles.nightShift} onClick={onNightShiftBtnClick}>
        夜勤
      </button>
      <button className={styles.off} onClick={onHolydayBtnClick}>
        休み
      </button>
    </div>
  );
}
