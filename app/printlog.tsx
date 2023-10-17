import moment from 'moment';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import Button from 'react-native-ui-lib/button';
import ListItem from 'react-native-ui-lib/listItem';
import Text from 'react-native-ui-lib/text';
import View from 'react-native-ui-lib/view';
import { usePrintData } from '../store/usePrintData';
import { usePrintLog } from '../store/usePrintLog';
import { LogByDate } from '../types';
import { IconButton } from '../components/IconButton';
import { PrintDialog } from '../components/PrintDialog';


export default function PrintLogList () {
  const { reprintLog } = usePrintData();
  const { logs, purgePrintLogs } = usePrintLog();
  const [isPrintDialogVisible, setIsPrintDialogVisible] = useState(false);

  const [logByDate, setLogByDate] = useState<LogByDate>({});

  useEffect(() => {
    const logByDate = Array.from(logs)
      .sort((log1, log2) => log1.dateTime - log2.dateTime)
      .reverse()
      .reduce((logByDate: LogByDate, printLog) => {
        const date = moment(printLog.dateTime).format('L');
        return {
          ...logByDate,
          [date]: [...(logByDate[date] || []), printLog].sort(
            (log1, log2) => log2.dateTime - log1.dateTime
          ),
        };
      }, {});

    setLogByDate(logByDate);
  }, [logs, setLogByDate]);

  const showPrintDialog = useCallback(
    () => setIsPrintDialogVisible(true),
    [setIsPrintDialogVisible]
  );
  const hidePrintDialog = useCallback(
    () => setIsPrintDialogVisible(false),
    [setIsPrintDialogVisible]
  );
  return (
    <>
      <View style={{ width: '90%', height: '70%', marginTop: 20 }}>
        <FlatList
          data={Object.entries(logByDate)}
          keyExtractor={([date]) => date}
          renderItem={({ item: [date, printLogs] }) => {
            return (
              <View key={date}>
                <Text text50H>{date}</Text>
                <FlatList
                  data={printLogs}
                  keyExtractor={(printLog) => printLog.id}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: StyleSheet.hairlineWidth,
                        backgroundColor: Colors.contrast,
                      }}
                    />
                  )}
                  renderItem={({ item: printLog }) => {
                    return (
                      <View
                        style={{
                          justifyContent: 'space-between',
                          flex: 1,
                          marginTop: 10,
                          flexDirection: 'row',
                        }}
                        key={printLog.id}>
                        <View style={{ maxWidth: '90%' }}>
                          <Text h3>
                            {printLog.items
                              .map(({ name }) => name)
                              .sort()
                              .join(', ')}
                          </Text>
                          {printLog.categories?.length > 0 && (
                            <Text p>
                              {'Geschmack: ' +
                                printLog.categories
                                  ?.map(({ name }) => name)
                                  .sort()
                                  .join(', ')}
                            </Text>
                          )}
                        </View>
                        <ListItem.Part right>
                          <IconButton size={20} onPress={showPrintDialog} name={'printer'} />
                        </ListItem.Part>
                        <PrintDialog
                          isVisible={isPrintDialogVisible}
                          hasCategorySelection={false}
                          onCancel={hidePrintDialog}
                          onFinish={(hasPrintOffset: boolean) =>
                            reprintLog(printLog, hasPrintOffset)
                          }
                        />
                      </View>
                    );
                  }}
                />
              </View>
            );
          }}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 180,
        }}>
        <Button style={{ backgroundColor: 'transparent' }} onPress={purgePrintLogs}>
          <Text h3 color={Colors.alert}>
            {'Alle löschen'}
          </Text>
        </Button>
      </View>
    </>
  );
};
