import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDatabaseConnection } from "../data/connection";
import { Item, PrintLog } from "../data/model";
import { LoggedItem } from "../data/model/LoggedItem";
import { LogByDate, PrintCategory, PrintItem, PrintLogs } from "../types";
import { useAppState } from "./appState";
import { Logs } from "expo";
import { LoggedCategory } from "../data/model/LoggedCategory";

export const usePrintLog = (): {
  logs: PrintLogs;
  createPrintLogEntry: (
    items: Array<PrintItem>,
    categories: Array<PrintCategory>,
    dateTime: number
  ) => Promise<PrintLog>;
  purgePrintLogs: () => Promise<void>;
} => {
  const { printLogRepository, loggedItemRepository, loggedCategoryRepository } =
    useDatabaseConnection();
  const {
    state: { log },
  } = useAppState();

  useEffect(() => {
    const initializeItems = async () => {
      const logs = (await printLogRepository?.getAll()) || [];
      log.set(logs);
    };
    initializeItems();
  }, []);

  const createPrintLogEntry = useCallback(
    async (
      items: Array<PrintItem>,
      categories: Array<PrintCategory>,
      dateTime: number
    ) => {
      const loggedItems: Array<LoggedItem> = [];
      for (const { name, contains_allergens } of items) {
        const newLoggedItem = await loggedItemRepository.getOrCreateLoggedItem(
          name,
          contains_allergens
        );
        loggedItems.push(newLoggedItem);
      }
      const loggedCategories: Array<LoggedCategory> = [];
      for (const { name } of categories) {
        const newLoggedCategory =
          await loggedCategoryRepository.getOrCreateLoggedCategory(name);
        loggedCategories.push(newLoggedCategory);
      }
      console.log({printLogRepository})
      const printLog = await printLogRepository.create({
        items: loggedItems,
        categories: loggedCategories,
        dateTime,
      });

      log.merge([printLog]);
      return printLog;
    },
    []
  );

  const purgePrintLogs = useCallback(async () => {
    await printLogRepository.deleteAll();
    await loggedItemRepository.deleteAll();
    log.set([]);
  }, []);

  return {
    logs: log.get({ noproxy: true }),
    createPrintLogEntry,
    purgePrintLogs,
  };
};
