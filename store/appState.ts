import { hookstate as createState, useHookstate } from '@hookstate/core';
import { AppState } from '../types';

const defaultState: AppState = {
  selection: {
    selectedItemIds: [],
    selectedCategories: [],
  },
  inventory: {
    items: [],
    categories: [],
  },
  log: [],
  general: {
    isLoggedIn: false,
  },
};

const globalState = createState<AppState>(defaultState);

export const useAppState = () => {
  const state = useHookstate<AppState>(globalState);
  return {
    state,
  };
};
