import styles from './styles.module.css';

import {useRouter} from 'next/router';
import Footer from '../../src/components/ui/footer/Footer';
import {useFooterActions} from '../../src/hooks/useFooterActions';

const ChatIndexPage = () => {
  const router = useRouter();

  const {onCalendarBtnClick, onChatBtnClick} = useFooterActions(router);

  return (
    <div className={styles.chatPageWrapper}>
      <input
        type="search"
        className={styles.searchInput}
        placeholder="search friend"
      />
      {/* 一覧表示(SP) */}
      <div className={styles.chatLists}>
        {/* demo */}
        <div className={styles.chatList}>
          <img src="" alt="" className={styles.chatImg} />
          <div className={styles.chatListContent}>
            <p className={styles.chatPersonName}>うーな</p>
            <p className={styles.chatLastSentence}>最後の文章</p>
          </div>
        </div>
      </div>

      <Footer
        onChatBtnClick={onChatBtnClick}
        onCalendarBtnClick={onCalendarBtnClick}
      />
    </div>
  );
};

export default ChatIndexPage;
