import styles from './styles.module.css';

import Footer from '../../src/components/ui/footer/Footer';
import {useFooterActions} from '../../src/hooks/useFooterActions';
import Link from 'next/link';
import {useEffect, useMemo, useState} from 'react';
import {UserResponse} from './types';

const ChatIndexPage = () => {
  const [userData, setUserData] = useState<UserResponse[]>([]);
  const [searchValue, setSearchValue] = useState<string>(''); // 文字列検索用
  const {onCalendarBtnClick, onChatBtnClick, onProfileBtnClick} =
    useFooterActions();

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      const res = await fetch('/api/users', {
        method: 'GET',
      });
      const data: UserResponse[] = await res.json();
      setUserData(data);
    };
    fetchUsers();
  }, []);

  const filteredUserData: UserResponse[] = useMemo(() => {
    return searchValue
      ? userData.filter(user => user.name.includes(searchValue))
      : userData;
  }, [userData, searchValue]);

  return (
    <div className={styles.chatPageWrapper}>
      <input
        type="search"
        className={styles.searchInput}
        placeholder="search friend"
        value={searchValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchValue(e.target.value)
        }
      />

      {filteredUserData.map((user, index) => (
        <Link
          key={index}
          className={styles.chatLists}
          href={{pathname: `/chat/${user.id}`, query: {name: user.name}}}
        >
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
        onProfileBtnClick={onProfileBtnClick}
      />
    </div>
  );
};

export default ChatIndexPage;
