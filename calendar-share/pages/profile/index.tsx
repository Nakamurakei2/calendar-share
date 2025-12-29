import Link from 'next/link';
import Footer from '../../src/components/ui/footer/Footer';
import ProfileHeader from '../../src/components/ui/ProfileHeader/ProfileHeader';
import {useFooterActions} from '../../src/hooks/useFooterActions';
import styles from './styles.module.css';

const ProfileIndexPage = () => {
  const {onCalendarBtnClick, onChatBtnClick, onProfileBtnClick} =
    useFooterActions();

  return (
    <div className={styles.profileWrapper}>
      <ProfileHeader />

      <div className={styles.profileContainer}>
        <p className={styles.profileSubtitle}>基本情報</p>

        <div className={styles.profileContent}>
          <p className={styles.title}>電話番号</p>
          <p className={styles.value}>090-0000-0000</p>
        </div>

        <div className={styles.profileContent}>
          <p className={styles.title}>名前</p>
          <p className={styles.value}>demo中村</p>
        </div>
      </div>

      <p className={styles.contactLink}>
        お問い合わせは <Link href="/contact">こちら</Link>から
      </p>
      <Footer
        onCalendarBtnClick={onCalendarBtnClick}
        onChatBtnClick={onChatBtnClick}
        onProfileBtnClick={onProfileBtnClick}
      />
    </div>
  );
};

export default ProfileIndexPage;
