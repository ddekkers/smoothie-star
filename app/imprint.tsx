import Constants from 'expo-constants';
import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import { Row } from '../components/Row';

interface ILegalNoticeScreenProps {}

const LegalNoticeScreen: React.FC<ILegalNoticeScreenProps> = ({}) => {
  return (
    <View style={styles.container}>
      <Text style={{alignSelf: "center"}} h1>{Constants.expoConfig?.name}</Text>
      <ScrollView>
        <Text h3>Entwickler</Text>
        <Row style={{marginBottom: 10}}>
          <Text p style={styles.boldText}>
            Name:
          </Text>
          <Text p>Daniel Dekkers</Text>
        </Row>
        <Row style={{marginBottom: 10}}>
          <Text p style={styles.boldText}>
            Anschrift:
          </Text>
          <Text p>Am Brunnenhof 25, 22787 Hamburg, DE</Text>
        </Row>
        <Row style={{marginBottom: 10}}>
          <Text p style={styles.boldText}>
            E-Mail:
          </Text>
          <Text p>daniel_dekkers@web.de</Text>
        </Row>
        {/* <Button onPress={() => storeIsLoggedIn()}>
          <Text h2>{isLoggedIn ? 'Eingeloggt' : 'Nicht eingeloggt'}</Text>
        </Button> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 40,
    paddingTop: 50,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  boldText: { fontWeight: 'bold', marginRight: 15 },
});

export default LegalNoticeScreen