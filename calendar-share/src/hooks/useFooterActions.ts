export const useFooterActions = router => {
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
