import Image from 'next/image';
import styles from './Footer.module.css';

type FooterProps = {
  onCalendarBtnClick: () => void;
  onChatBtnClick: () => void;
  onProfileBtnClick: () => void;
};

export default function Footer({
  onCalendarBtnClick,
  onChatBtnClick,
  onProfileBtnClick,
}: FooterProps) {
  return (
    <div className={styles.footerWrapper}>
      <Image
        src="/images/calendar.jpg"
        alt="calendar image"
        width={35}
        height={35}
        onClick={onCalendarBtnClick}
      />
      <Image
        src="/images/message.jpg"
        alt="message image"
        width={50}
        height={50}
        onClick={onChatBtnClick}
      />
      <Image
        src="/images/profile.jpg"
        alt="profile image"
        width={30}
        height={30}
        onClick={onProfileBtnClick}
      />
    </div>
  );
}
