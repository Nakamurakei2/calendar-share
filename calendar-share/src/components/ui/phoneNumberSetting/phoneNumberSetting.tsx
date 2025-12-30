import styles from './styles.module.css';

type Props = {
  close: () => void;
};

const PhoneNumberSetting = ({close}: Props) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>電話番号を変更</h2>
          <button className={styles.closeButton} onClick={() => close()}>
            ×
          </button>
        </header>

        <div className={styles.card}>
          <div className={styles.field}>
            <label>現在の電話番号</label>
            <p className={styles.current}>000-0000-0000</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="newPhoneNumber">新しい電話番号</label>
            <input
              id="newPhoneNumber"
              type="text"
              placeholder="090-1234-5678"
            />
          </div>

          <button className={styles.saveButton}>変更を保存</button>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberSetting;
