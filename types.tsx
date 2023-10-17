/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Item } from './data/model';
import { Category } from './data/model/Category';
import { PrintLog } from './data/model/PrintLog';
import { ImmutableArray } from '@hookstate/core';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Start: undefined;
  Einstellungen: MaterialTopTabScreenProps<ConfigTabParamList>;
  Impressum: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type ConfigTabParamList = {
  Zutaten: undefined;
  Geschmäcker: undefined;
};

export type ConfigTabScreenProps<Screen extends keyof ConfigTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<ConfigTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

type Id = string;

type Inventory = {
  items: Array<Item>;
  categories: Array<Category>;
};

type Selection = {
  selectedItemIds: Array<Id>;
  selectedCategories: Array<Id>;
};

export type PrintItem = Pick<Item, 'name' | 'contains_allergens'>;

export type PrintCategory = Pick<Category, 'name'>;

export type PrintLogs = ImmutableArray<PrintLog>;

export type LogByDate = { [date: string]: PrintLogs };

export type ImageInfo = {
  imageUrl: string;
  photographer: string;
};

type General = {
  isLoggedIn: boolean;
};

export type AppState = {
  selection: Selection;
  inventory: Inventory;
  log: PrintLogs;
  general: General;
};
