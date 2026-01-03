import Link from 'next/link';
import Footer from '../../src/components/ui/footer/Footer';
import ProfileHeader from '../../src/components/ui/ProfileHeader/ProfileHeader';
import {useFooterActions} from '../../src/hooks/useFooterActions';
import {useProfileSettingActions} from '../../src/hooks/useProfileSettingActions';
import styles from './styles.module.css';
import PhoneNumberSetting from '../../src/components/ui/phoneNumberSetting/phoneNumberSetting';
import UsernameSetting from '../../src/components/ui/usernameSetting/usernameSetting';
import {useEffect, useState} from 'react';
import {UserDataResponse} from '../api/getUserData';

const ProfileIndexPage = () => {
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const {onCalendarBtnClick, onChatBtnClick, onProfileBtnClick} =
    useFooterActions();

  const {activeSetting, openPhone, openUsername, close} =
    useProfileSettingActions();

  useEffect(() => {
    // 最新のユーザー情報を取得
    const getCurrentUser = async () => {
      const res = await fetch('/api/getUserData', {
        method: 'GET',
      });

      if (!res.ok) {
        console.error('HTTP error', res.status);
        return;
      }

      const resData: UserDataResponse = await res.json();
      if (resData.status === 'success') {
        const username = resData.username;
        if (username) setCurrentUsername(username);
      }
    };
    getCurrentUser();
  }, []);

  return (
    <div className={styles.profileWrapper}>
      <ProfileHeader />

      {activeSetting === 'phoneNumber' ? (
        <PhoneNumberSetting close={close} />
      ) : activeSetting === 'username' ? (
        <UsernameSetting close={close} currentUsername={currentUsername} setCurrentUsername={setCurrentUsername} />
      ) : null}

      <div className={styles.profileContainer}>
        <p className={styles.profileSubtitle}>基本情報</p>

        {/* <div className={styles.profileContent} onClick={openPhone}>
          <p className={styles.title}>電話番号</p>
          <p className={styles.value}>090-0000-0000</p>
        </div> */}

        <div className={styles.profileContent} onClick={openUsername}>
          <p className={styles.title}>名前</p>
          <p className={styles.value}>{currentUsername}</p>
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
