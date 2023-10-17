import { useCallback } from 'react';
import { useSelection } from './useSelection';

export const useSelectedItems = () => {
  const { selection } = useSelection();
  const { selectedItemIds } = selection;

  const toggleSelection = (itemId: string) => {
    if (selectedItemIds.value.includes(itemId)) {
      selectedItemIds.set(selectedItemIds.value.filter((id) => itemId !== id));
    } else {
      selectedItemIds[selectedItemIds.length].set(itemId);
    }
  };

  const resetItemSelection = useCallback(async () => {
    selectedItemIds.set([]);
  }, [selectedItemIds]);

  return {
    toggleSelection,
    resetItemSelection,
    selectedItemIds: selectedItemIds.get({ noproxy: true }),
  };
};
