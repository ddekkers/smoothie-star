import { useEffect } from 'react';
import { useAppState } from './appState';

const IS_LOGGED_IN_KEY = 'isLoggedInKey';

export const useIsLoggedIn = () => {
  const { state } = useAppState();
  const { isLoggedIn } = state.general;
  const setIsLoggedIn = async () => {
    // const isLoggedInValue = (await AsyncStorage.getItem(IS_LOGGED_IN_KEY)) === 'true';
    // isLoggedIn?.set(isLoggedInValue);
  };
  useEffect(() => {
    setIsLoggedIn();
  }, []);

  const storeIsLoggedIn = async () => {
    // await AsyncStorage.setItem(IS_LOGGED_IN_KEY, isLoggedIn ? 'false' : 'true');

    await setIsLoggedIn();
  };
  return {
    isLoggedIn: isLoggedIn.get({ noproxy: true }),
    storeIsLoggedIn,
  };
};
