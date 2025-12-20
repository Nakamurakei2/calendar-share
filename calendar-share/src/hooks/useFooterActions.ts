export const useFooterActions = router => {
  // calendar btn click
  const onCalendarBtnClick = () => {
    router.push('/');
  };

  // chat btn click
  const onChatBtnClick = () => {
    router.push('/chat');
  };

  return {
    onCalendarBtnClick,
    onChatBtnClick,
  };
};
