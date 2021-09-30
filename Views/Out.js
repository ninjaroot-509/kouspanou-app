import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';
import { Card } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome } from 'react-native-vector-icons';
import { getUser, removeUserSession } from '../Components/Common/Auth/Sessions';

export default function Stats({ navigation }) {
  React.useEffect(() => {
    getUser().then((res) => console.log('tes ' + res.username));
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator
        color="#ff8612"
        size="large"
        style={{ alignItems: 'center' }}
      />
      <Text style={{ padding: 17 }}>Oupps!, une erreur s'est produite.</Text>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Se Déconnecter',
            'Es-tu sûr? De vouloir se déconnecter?',
            [
              {
                text: 'Annuler',
                onPress: () => {
                  return null;
                },
              },
              {
                text: 'Confirmer',
                onPress: () => {
                  removeUserSession();
                  navigation.replace('SplashScreen');
                },
              },
            ],
            { cancelable: false }
          );
        }}
        style={{
          width: 120,
          height: 40,
          backgroundColor: '#ff8612',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10
        }}>
        <Text style={{ color: 'white' }}>Deconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 0,
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
