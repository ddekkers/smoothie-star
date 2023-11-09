import * as Print from 'expo-print';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import 'moment/locale/de';
import { useCallback, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { PrintLog } from '../data/model';
import { usePrintLog } from './usePrintLog';
import { useItems } from './useItems';
import { useSelectedCategories } from './useSelectedCategories';
import { useSelectedItems } from './useSelectedItems';
import { PrintCategory, PrintItem } from '../types';
import { useCategories } from './useCategories';
import { LOGO_SVG } from '../static/logo';
import { ImmutableArray, ImmutableObject } from '@hookstate/core';
import { shareAsync } from 'expo-sharing';

type PrintData = {
  items: Array<PrintItem>;
  date: string;
  time: string;
  categories: Array<PrintCategory>;
  hasAnyAllergens: boolean;
};

const PRINT_HTML_PATH = '../static/print_data.html';
const createListItemHtml = (item: PrintItem | null) => {
  if (!item) return '';
  return item.contains_allergens
    ? `
    <li style="margin-bottom: 10px">
    <p><strong style="font-size: 32px;">- ${item.name}*</strong></p>
    </li>
    `
    : `
    <li style="margin-bottom: 10px">
      <p><span style="font-size: 32px;">- ${item.name}</span></p>
    </li>
    `;
};

const createAllergensInfoHtml = () =>
  `<p style="font-size: 24px; margin-top: 30px;"><strong>*Allergene:</strong> Diese Zutat enth&auml;lt Allergene. F&uuml;r mehr Informationen siehe Info-Tafel.</p>`;
const createCategoriesInfoHtml = (categories: Array<PrintCategory>) =>
  categories.length < 1
    ? ''
    : `<p style="font-size: 32px; color: #5e9ca0;"><span
      style="color: #000000;"><strong>Geschmack:</strong> ${categories
        .map((cat) => cat.name)
        .join(', ')}</span></p>`;

const PRINT_URL_TEMPLATE = `starpassprnt://v1/print/nopreview?back=${
  Constants.expoConfig?.name || 'smoothie-star'
}://&html={{ htmlContent }}`;
const OFFSET_STRING = '300px';
const HTML_CONTENT_PLACEHOLDER = `{{ htmlContent }}`;
const ITEM_LIST_PLACEHOLDER = '{{ itemList }}';
const CATEGORY_LIST_PLACEHOLDER = '{{ categoryList }}';
const DATE_PLACEHOLDER = '{{ date }}';
const TIME_PLACEHOLDER = '{{ time }}';
const ALLERGENS_INFO_PLACEHOLDER = '{{ allergensInfo }}';
const LOGO_PLACEHOLDER = '{{ logo }}';
const OFFSET_PLACEHOLDER = '{{ offset }}';
const resolveHtml = (
  html: string,
  { date, time, items, categories, hasAnyAllergens }: PrintData,
  logoSvg: string,
  hasOffset: boolean
) => {
  const itemsHtml = items.map(createListItemHtml).join('\n');
  return html
    .replace(OFFSET_PLACEHOLDER, hasOffset ? OFFSET_STRING : '0px')
    .replace(LOGO_PLACEHOLDER, logoSvg)
    .replace(ITEM_LIST_PLACEHOLDER, itemsHtml)
    .replace(CATEGORY_LIST_PLACEHOLDER, createCategoriesInfoHtml(categories))
    .replace(DATE_PLACEHOLDER, date)
    .replace(TIME_PLACEHOLDER, time)
    .replace(ALLERGENS_INFO_PLACEHOLDER, hasAnyAllergens ? createAllergensInfoHtml() : '');
};

const resolvePrintUrl = (html: string) =>
  PRINT_URL_TEMPLATE.replace(HTML_CONTENT_PLACEHOLDER, encodeURIComponent(html));

export const usePrintData = () => {
  const { createPrintLogEntry } = usePrintLog();
  const { getItemById } = useItems();
  const { getCategoryById } = useCategories();

  const resolvePrintData = useCallback(
    async (
      moment: moment.Moment,
      selectedItems: Array<PrintItem>,
      selectedCategories: Array<PrintCategory>
    ) => {
      const printData: PrintData = {
        date: moment.format('L'),
        time: moment.format('LT'),
        items: selectedItems,
        categories: selectedCategories,
        hasAnyAllergens: selectedItems.some((item) => item?.contains_allergens),
      };
      return printData;
    },
    []
  );

  const printLog = useCallback(
    async (
      items: Array<PrintItem>,
      categories: Array<PrintCategory>,
      hasOffset: boolean,
      createLogEntry: boolean = true
    ) => {
      const now = moment().locale('de');
      const printData = await resolvePrintData(now, items, categories);
      await Asset.loadAsync(require(PRINT_HTML_PATH));
      const htmlAsset = await Asset.fromModule(require(PRINT_HTML_PATH)).downloadAsync();
      if (htmlAsset.localUri || htmlAsset.uri) {
        const htmlAsString = await FileSystem.readAsStringAsync(htmlAsset.localUri || htmlAsset.uri);

        const html = resolveHtml(htmlAsString, printData, LOGO_SVG, hasOffset);

        const printUrl = resolvePrintUrl(html);
        try {
          await Linking.openURL(printUrl);
        } catch (e){
          try {
            await Print.printAsync({html})

            // const file = await Print.printToFileAsync({html})
            // await shareAsync(file.uri, { UTI: '.pdf', mimeType: 'application/pdf' })
          } catch (e) {
            console.log('Error printing...', e);
          }
        }
        createLogEntry &&
          (await createPrintLogEntry(
            printData.items,
            printData.categories,
            now.toDate().getTime()
          ));
      }
    },
    [createPrintLogEntry, resolvePrintData]
  );

  const print = useCallback(
    async (
      hasOffset: boolean,
      selectedItemIds: ImmutableArray<string>,
      selectedCategoryIds: ImmutableArray<string>
    ) => {
      const items: Array<PrintItem> = [];
      for await (const itemId of selectedItemIds) {
        const item = await getItemById(itemId);
        if (item) items.push({ name: item.name, contains_allergens: item.contains_allergens });
      }
      const categories: Array<PrintCategory> = [];
      for await (const catId of selectedCategoryIds) {
        const category = await getCategoryById(catId);
        if (category) categories.push({ name: category.name });
      }
      await printLog(items, categories, hasOffset);
    },
    [getItemById]
  );

  const reprintLog = useCallback(async (log: ImmutableObject<PrintLog>, hasPrintOffset: boolean) => {
    const { items, categories } = log;
    await printLog(
      items.map(({ name, contains_allergens }) => ({ name, contains_allergens })),
      categories.map(({ name }) => ({ name })),
      hasPrintOffset
    );
  }, []);

  return { print, reprintLog };
};
