import { useCallback, useEffect } from "react";
import { useDatabaseConnection } from "../data/connection";
import { ICreateCategoryData } from "../data/model";
import { useInventory } from "./useInventory";

export const useCategories = () => {
  const { categoryRepository } = useDatabaseConnection();
  const { inventory } = useInventory();
  const { categories } = inventory;

  useEffect(() => {
    const initializeCategories = async () => {
      categories.set((await categoryRepository?.getAll()) || []);
    };
    if (inventory.categories.value.length < 1) {
      initializeCategories();
    }
  }, []);

  const getCategoryById = useCallback(async (id: string) => {
    return await categoryRepository.getCategoryById(id);
  }, []);

  const createCategory = useCallback(
    async ({ name, color = "" }: ICreateCategoryData) => {
      const category = await categoryRepository.create({
        name,
        color,
      });
      categories[categories.length].set(category);
    },
    [categories]
  );

  const deleteAllCategories = useCallback(async () => {
    await categoryRepository.deleteAll();
    categories.set([]);
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await categoryRepository.delete(id);
    categories.set(categories.value.filter((category) => category.id != id));
  }, []);

  return {
    getCategoryById,
    createCategory,
    deleteAllCategories,
    deleteCategory,
    categories: categories.get({ noproxy: true }),
  };
};
