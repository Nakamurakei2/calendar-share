import {useRouter} from 'next/router';

export const useFooterActions = () => {
  // todo: ここでuseRouterを定義
  const router = useRouter();
  // calendar btn click
  const onCalendarBtnClick = () => {
    router.push('/');
  };

  // chat btn click
  const onChatBtnClick = () => {
    router.push('/chat');
  };

  // profile btn click
  const onProfileBtnClick = () => {
    router.push('/profile');
  };

  return {
    onCalendarBtnClick,
    onChatBtnClick,
    onProfileBtnClick,
  };
};
