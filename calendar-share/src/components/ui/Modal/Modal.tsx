import {ChangeEvent, useContext, useEffect, useState} from 'react';
import styles from './Modal.module.css';
import {AddEvent, MyContext} from '../../../../pages';

type ModalProps = {
  onSubmit: (data: AddEvent) => Promise<void>;
  onCloseDialog: () => void;
};

export default function Modal({onSubmit, onCloseDialog}: ModalProps) {
  const {type, content, description, startDate, endDate} =
    useContext(MyContext);

  const [selectValue, setSelectValue] = useState<string>(type);
  const [contentValue, setContentValue] = useState<string>(content);
  const [contentDescription, setContentDescription] =
    useState<string>(description);
  const [startTime, setStartTime] = useState<string>(startDate);
  const [endTime, setEndTime] = useState<string>(endDate);
  const [email, setEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('email') ?? '';
    } else return '';
  });

  const data: AddEvent = {
    type: selectValue,
    content: contentValue,
    description: contentDescription,
    startDate: startTime,
    endDate: endTime,
    email: email,
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>イベント追加</h2>

        <label>
          イベント種類:
          <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSelectValue(e.target.value)
            }
          >
            <option value="holiday" selected>
              休暇
            </option>
            <option value="work">仕事</option>
            <option value="other">その他</option>
          </select>
        </label>

        <label>
          内容:
          <input
            type="text"
            placeholder="イベント名"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setContentValue(e.target.value)
            }
          />
        </label>

        <label>
          メモ:
          <textarea
            placeholder="詳細メモを入力"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setContentDescription(e.target.value)
            }
          />
        </label>

        <label>
          日時:
          <input
            type="datetime-local"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStartTime(e.target.value)
            }
            value={startTime}
            max="9999-12-31"
          />
        </label>

        {/* <label>
          終了日時:
          <input
            type="datetime-local"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEndTime(e.target.value)
            }
            max="9999-12-31" // 年は4桁まで
          />
        </label> */}

        <div className={styles.modalActions}>
          <button type="button" onClick={() => onSubmit(data)}>
            追加
          </button>
          <button type="button" onClick={() => onCloseDialog()}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
