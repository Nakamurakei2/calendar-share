import React, {useEffect, useReducer} from 'react';
import Footer from '../../src/components/ui/footer/Footer';
import {useFooterActions} from '../../src/hooks/useFooterActions';
import styles from './styles.module.css';

type State = {
  name: string;
  email: string;
  content: string;
};

type Action = {
  type: string;
  payload?: {
    inputType: string;
    value: string;
  };
};

const formReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'changeState':
      if (action.payload)
        return {
          ...state,
          [action.payload.inputType]: action.payload.value,
        };

    case 'resetState':
      return formInitialValue;
  }
  return state;
};

const formInitialValue: State = {
  name: '',
  email: '',
  content: '',
};

const isValidate = (state: State): string | null => {
  if (!state.name) return '名前を入力してください';
  if (!state.email) return 'メールアドレスを入力してください';
  if (!state.content) return 'お問い合わせ内容を入力してください';

  return null;
};

const ContactIndexPage = () => {
  const [state, dispatch] = useReducer(formReducer, formInitialValue);
  const {onCalendarBtnClick, onChatBtnClick, onProfileBtnClick} =
    useFooterActions();

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const errorMessage: string | null = isValidate(state);
    if (errorMessage) alert(errorMessage);

    const res = await fetch('/api/mailer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });
    if (res.ok) {
      dispatch({type: 'resetState'});
      alert('送信されました');
    }
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const target = e.target;

    dispatch({
      type: 'changeState',
      payload: {
        inputType: target.name,
        value: e.target.value,
      },
    });
  };

  return (
    <form className={styles.contactWrapper}>
      <h1 className={styles.title}>問い合わせ</h1>
      <div className={styles.contactContainer}>
        <label htmlFor="name">名前</label>
        <input
          id="name"
          type="text"
          name="name"
          value={state.name}
          onChange={e => onChange(e)}
        />

        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="text"
          name="email"
          value={state.email}
          onChange={e => onChange(e)}
        />

        <label htmlFor="content">お問い合わせ内容</label>
        <textarea
          name="content"
          id="content"
          value={state.content}
          onChange={e => onChange(e)}
        ></textarea>

        <button
          className={
            state.name && state.email && state.content
              ? styles.submitBtn
              : styles.disableSubmitBtn
          }
          type="submit"
          onClick={e => onSubmit(e)}
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
