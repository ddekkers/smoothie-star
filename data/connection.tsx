import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator } from 'react-native';
import { Connection, createConnection, DataSource } from 'typeorm';
import { Category, Item, PrintLog } from './model';
import { LoggedItem } from './model/LoggedItem';
import { LoggedCategory } from './model/LoggedCategory';
import { ItemsRepository } from './repository';
import { PrintLogsRepository } from './repository/PrintLogsRepository';
import { LoggedItemsRepository } from './repository/LoggedItemsRepository';
import { LoggedCategoriesRepository } from './repository/LoggedCategoriesRepository';
import { CategoryRepository } from './repository/CategoryRepository';

interface DatabaseConnectionContextData {
  itemsRepository: ItemsRepository;
  categoryRepository: CategoryRepository;
  printLogRepository: PrintLogsRepository;
  loggedItemRepository: LoggedItemsRepository;
  loggedCategoryRepository: LoggedCategoriesRepository;
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData
);

export const DatabaseConnectionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null);

  const connect = useCallback(async () => {
    const connection = new DataSource({
      type: 'expo',
      database: 'items.db',
      driver: require('expo-sqlite'),
      entities: [Item, Category, LoggedItem, LoggedCategory, PrintLog],
      synchronize: true,
    });
    
    try {
      await connection.initialize()
      console.log("Database successfully initialized")
    } catch (error) {
      console.log("Error initializing database", error)
    }

    setConnection(connection);
  }, []);

  useEffect(() => {
    const connectAsync = async () => await connect();
    if (!connection) {
      connectAsync();
    }
  }, [connect, connection]);

  if (connection === null) {
    return <ActivityIndicator />;
  }

  return (
    <DatabaseConnectionContext.Provider
      value={{
        itemsRepository: new ItemsRepository(connection),
        categoryRepository: new CategoryRepository(connection),
        printLogRepository: new PrintLogsRepository(connection),
        loggedItemRepository: new LoggedItemsRepository(connection),
        loggedCategoryRepository: new LoggedCategoriesRepository(connection),
      }}>
      {children}
    </DatabaseConnectionContext.Provider>
  );
};

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext);

  return context;
}
