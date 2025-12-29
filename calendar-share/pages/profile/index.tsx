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
      <Footer
        onCalendarBtnClick={onCalendarBtnClick}
        onChatBtnClick={onChatBtnClick}
        onProfileBtnClick={onProfileBtnClick}
      />
    </div>
  );
};

export default ProfileIndexPage;
