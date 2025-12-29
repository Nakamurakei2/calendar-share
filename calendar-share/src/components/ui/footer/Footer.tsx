import styles from './Footer.module.css';

type FooterProps = {
  onCalendarBtnClick: () => void;
  onChatBtnClick: () => void;
};

export default function Footer({
  onCalendarBtnClick,
  onChatBtnClick,
}: FooterProps) {
  return (
    <div className={styles.footerWrapper}>
      <button onClick={onCalendarBtnClick}>カレンダー</button>
      <button onClick={onChatBtnClick}>トーク</button>
    </div>
  );
}
