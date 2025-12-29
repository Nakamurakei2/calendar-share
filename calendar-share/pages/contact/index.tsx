import Footer from '../../src/components/ui/footer/Footer';
import {useFooterActions} from '../../src/hooks/useFooterActions';
import styles from './styles.module.css';

const ContactIndexPage = () => {
  const {onCalendarBtnClick, onChatBtnClick, onProfileBtnClick} =
    useFooterActions();

  const onSubmit = () => {
    console.log('submit btn clicked');
  };

  return (
    <form className={styles.contactWrapper}>
      <h1 className={styles.title}>問い合わせ</h1>
      <div className={styles.contactContainer}>
        <label htmlFor="username">名前</label>
        <input id="username" type="text" />

        <label htmlFor="email">メールアドレス</label>
        <input id="email" type="text" />

        <label htmlFor="content">お問い合わせ内容</label>
        <textarea name="content" id="content"></textarea>

        <button
          className={styles.submitBtn}
          type="submit"
          onClick={() => onSubmit()}
        >
          送信
        </button>
      </div>

      <Footer
        onCalendarBtnClick={onCalendarBtnClick}
        onChatBtnClick={onChatBtnClick}
        onProfileBtnClick={onProfileBtnClick}
      />
    </form>
  );
};

export default ContactIndexPage;
