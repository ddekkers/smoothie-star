import { useAppState } from './appState';

export const useInventory = () => {
  const { state } = useAppState();

  const { inventory } = state;
  return { inventory };
};
