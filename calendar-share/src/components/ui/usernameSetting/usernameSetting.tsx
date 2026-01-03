import React, {useState} from 'react';
import styles from './styles.module.css';
import {ResponseData} from '../../../../types/global';
import {useLoading} from '../../../../src/hooks/useLoading';

type Props = {
  close: () => void;
};

const UsernameSetting = ({close}: Props) => {
  const [newUsername, setNewUsername] = useState<string>('');

  const {loading, withLoading} = useLoading();

  const updateUsername = async () => {
    await withLoading(async () => {
      const res = await fetch('/api/updateUsername', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUsername,
        }),
      });

      if (!res.ok) {
        console.error('HTTP error', res.status);
        return;
      }
      const resData: ResponseData = await res.json();
      if (resData.status === 'success') {
        console.debug(resData.message);
        close(); // 成功した場合に何か表示させたい
      }
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>ユーザー名変更</h2>
          <button className={styles.closeButton} onClick={() => close()}>
            ×
          </button>
        </header>

        <div className={styles.card}>
          <div className={styles.field}>
            <label>現在のユーザー名</label>
            <p className={styles.current}>demo太郎</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="newUsername">新しいユーザー名</label>
            <input
              id="newUsername"
              type="text"
              placeholder=""
              value={newUsername}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUsername(e.target.value)
              }
            />
          </div>

          <button
            className={
              newUsername.length > 0
                ? styles.saveButton
                : styles.disableSaveButton
            }
            onClick={() => updateUsername()}
            disabled={loading}
          >
            変更を保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsernameSetting;
