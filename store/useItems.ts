import { State } from "@hookstate/core";
import { useCallback, useEffect, useState } from "react";
import { useDatabaseConnection } from "../data/connection";
import { ICreateItemData, Item } from "../data/model";
import { useInventory } from "./useInventory";

export const useItems = () => {
  const { itemsRepository } = useDatabaseConnection();
  const { inventory } = useInventory();
  const { items } = inventory;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const initializeItems = async () => {
      items.set((await itemsRepository?.getAll()) || []);
    };
    if (inventory.items.value.length < 1) {
      initializeItems();
    }
    setIsLoading(false);
  }, []);

  const getItemById = useCallback(async (id: string) => {
    return await itemsRepository.getItemById(id);
  }, []);

  const createItem = useCallback(
    async ({
      name,
      imageUri = "",
      color = "",
      containsAllergens = false,
      isAvailable = false,
    }: ICreateItemData) => {
      console.log("calling create on items repo")
      try {
        const item = await itemsRepository.create({
          name,
          imageUri,
          color,
          isAvailable,
          containsAllergens,
        });
        items[items.length].set(item);
        
      } catch (error) {
        console.log("error on items repo", error)
      }
    },
    [items]
  );

  const deleteAllItems = useCallback(async () => {
    await itemsRepository.deleteAll();
    items.set([]);
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    await itemsRepository.delete(id);
    items.set(items.value.filter((item) => item.id != id));
  }, []);

  const toggleItemAvailability = useCallback(async (id: string) => {
    const index = items.findIndex((item: State<Item>) => item.value.id === id);
    if (index < 0) return;

    const updatedItem = await itemsRepository.toggleItemAvailability(id);
    if (!updatedItem) return;

    items[index].set(updatedItem);
  }, []);

  const resetAllItemAvailabilities = useCallback(async () => {
    await itemsRepository.resetAllAvailabilities();
    items.forEach((item) => item.is_available.set(false));
  }, []);

  return {
    getItemById,
    createItem,
    deleteAllItems,
    deleteItem,
    toggleItemAvailability,
    resetAllItemAvailabilities,
    items: items.get({ noproxy: true }),
    availableItems: items.value.filter((item) => item.is_available),
    isLoading,
  };
};
