import styles from './styles.module.css';

import {useRouter} from 'next/router';
import Footer from '../../src/components/ui/footer/Footer';
import {useFooterActions} from '../../src/hooks/useFooterActions';
import Link from 'next/link';
import {ChangeEvent, useEffect, useState} from 'react';
import { UserResponse } from './types';

const ChatIndexPage = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [userData, setUserData] = useState<UserResponse[]>([]);
  const {onCalendarBtnClick, onChatBtnClick} = useFooterActions(router);

  useEffect(() => {
    // userデータをfetch
    const fetchUsers = async (): Promise<void> => {
      const res = await fetch('/api/users', {
        method: 'GET',
      });
      const data: UserResponse[] = await res.json();
      setUserData(data);
    }
    fetchUsers();
  },[]);

  // TODO：chatlist内検索処理
  const onChangechatListSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={styles.chatPageWrapper}>
      <input
        type="search"
        className={styles.searchInput}
        placeholder="search friend"
        value={inputValue}
        onChange={onChangechatListSearch}
      />

      {userData.map((user, id) => (
      <Link key={id} className={styles.chatLists} href={'/chat/room1'}>
        {/* demo */}
        <div className={styles.chatList}>
          <img src="" alt="" className={styles.chatImg} />
          <div className={styles.chatListContent}>
            <p className={styles.chatPersonName}>{user.name}</p>
            <p className={styles.chatLastSentence}>最後の文章</p>
          </div>
        </div>
      </Link>
      ))}

      <Footer
        onChatBtnClick={onChatBtnClick}
        onCalendarBtnClick={onCalendarBtnClick}
      />
    </div>
  );
};

export default ChatIndexPage;
