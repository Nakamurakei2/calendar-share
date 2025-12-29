import Link from 'next/link';
import styles from './styles.module.css';

const ProfileHeader = () => {
  return (
    <div className={styles.profileWrapper}>
      <p className={styles.profileHeader}>設定</p>

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
    </div>
  );
};
export default ProfileHeader;
