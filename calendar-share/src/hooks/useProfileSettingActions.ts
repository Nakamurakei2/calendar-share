import {useState} from 'react';

type SettingType = 'username' | 'phoneNumber' | null;

export const useProfileSettingActions = () => {
  const [activeSetting, setActiveSetting] = useState<SettingType | null>(null);

  const openPhone = () => setActiveSetting('phoneNumber');
  const openUsername = () => setActiveSetting('username');
  const close = () => setActiveSetting(null);

  return {activeSetting, openPhone, openUsername, close};
};
