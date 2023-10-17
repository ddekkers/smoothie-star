import { useCallback } from 'react';
import { useSelection } from './useSelection';

export const useSelectedCategories = () => {
  const { selection } = useSelection();
  const { selectedCategories: selectedCategoryIds } = selection;

  const toggleCategorySelection = useCallback(
    (category: string) => {
      if (selectedCategoryIds.value.includes(category)) {
        selectedCategoryIds.set(
          selectedCategoryIds.value.filter((selectedCategory) => selectedCategory !== category)
        );
      } else {
        selectedCategoryIds[selectedCategoryIds.length].set(category);
      }
    },
    [selectedCategoryIds]
  );

  const resetCategorySelection = useCallback(async () => {
    selectedCategoryIds.set([]);
  }, [selectedCategoryIds]);

  return {
    toggleCategorySelection,
    resetCategorySelection,
    selectedCategoryIds: selectedCategoryIds.get({ noproxy: true }),
  };
};
