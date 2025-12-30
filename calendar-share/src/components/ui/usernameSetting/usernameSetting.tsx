import styles from './styles.module.css';

type Props = {
  close: () => void;
};

const UsernameSetting = ({close}: Props) => {
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
            <input id="newUsername" type="text" placeholder="" />
          </div>

          <button className={styles.saveButton}>変更を保存</button>
        </div>
      </div>
    </div>
  );
};

export default UsernameSetting;
