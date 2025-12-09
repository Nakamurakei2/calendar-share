import {ChangeEvent, useContext, useEffect, useState} from 'react';
import styles from './Modal.module.css';
import {MyContext} from '../../../../pages';
import {AddDateRequestType} from '../Calendar/types';

export type ModalInfo = {
  type: string;
  description: string;
  startDate: string;
};

type ModalProps = {
  onSubmit: (data: AddDateRequestType) => Promise<void>;
  onCloseDialog: () => void;
  email: string;
};

export default function Modal({onSubmit, onCloseDialog, email}: ModalProps) {
  const {type, description, startDate} = useContext(MyContext);

  const [selectValue, setSelectValue] = useState<string>(type);
  const [contentDescription, setContentDescription] =
    useState<string>(description);
  const [startTime, setStartTime] = useState<string>(startDate);

  const data: AddDateRequestType = {
    type: selectValue,
    description: contentDescription,
    startDate: startTime,
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
            <option value="holiday">休暇</option>
            <option value="work">仕事</option>
            <option value="other">その他</option>
          </select>
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
            type="date"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStartTime(e.target.value)
            }
            value={startTime}
            max="9999-12-31"
          />
        </label>

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
