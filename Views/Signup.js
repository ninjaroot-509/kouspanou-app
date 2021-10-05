import React, { Component, useState, useRef } from 'react';
import {
  Button,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import Constants from 'expo-constants';
import { FontAwesome } from 'react-native-vector-icons';
import { setUserSession } from '../Components/Common/Auth/Sessions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import PhoneInput from 'react-native-phone-number-input';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Passengers from './SignupComp/Passengers';
import Drivers from './SignupComp/Drivers';

const renderScene = SceneMap({
  passenger: Passengers,
  driver: Drivers,
});

const Signup = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [is_passenger, setPassenger] = useState(false);
  const [is_driver, setDriver] = useState(false);
  const [load, setLoad] = useState(false);
  const phoneInput = useRef(null);
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const tel = formattedValue;

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'passenger', title: 'Passager' },
    { key: 'driver', title: 'Chauffeur' },
  ]);


  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          padding: 10,
        }}>
        <View style={{}}>
          <Image
            style={{
              width: 100,
              height: 100,
            }}
            source={require('../assets/logo.png')}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#001' }}>
            Inscrivez-vous
          </Text>
          <Text style={{ fontSize: 18, color: '#001' }}>
            Hello, bon retour
          </Text>
          <Text style={{ fontSize: 18, color: '#001' }}>
            Content de te revoir!
          </Text>
        </View>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route, color }) => (
              <Text style={{ color: '#001', margin: 8 }}>{route.title}</Text>
            )}
            style={{ backgroundColor: '#fff' }}
          />
        )}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};
export default Signup;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
  },
});
