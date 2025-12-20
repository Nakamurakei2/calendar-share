import styles from './styles.module.css';

import {useRouter} from 'next/router';
import Footer from '../../src/components/ui/footer/Footer';
import {useFooterActions} from '../../src/hooks/useFooterActions';
import Link from 'next/link';

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

      {/* 動的にhref要素を変更する */}
      <Link className={styles.chatLists} href={'/chat/room1'}>
        {/* demo */}
        <div className={styles.chatList}>
          <img src="" alt="" className={styles.chatImg} />
          <div className={styles.chatListContent}>
            <p className={styles.chatPersonName}>うーな</p>
            <p className={styles.chatLastSentence}>最後の文章</p>
          </div>
        </div>
      </Link>

      <Link className={styles.chatLists} href={'/chat/room2'}>
        {/* demo */}
        <div className={styles.chatList}>
          <img src="" alt="" className={styles.chatImg} />
          <div className={styles.chatListContent}>
            <p className={styles.chatPersonName}>room2</p>
            <p className={styles.chatLastSentence}>Room2の最後の文章</p>
          </div>
        </div>
      </Link>

      <Footer
        onChatBtnClick={onChatBtnClick}
        onCalendarBtnClick={onCalendarBtnClick}
      />
    </div>
  );
};

export default ChatIndexPage;
