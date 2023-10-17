import { useAppState } from './appState';

export const useSelection = () => {
  const { state } = useAppState();

  const { selection } = state;
  return { selection };
};
