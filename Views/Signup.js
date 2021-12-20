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
  Dimensions
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
const { width, height } = Dimensions.get('window');

const Signup = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [is_passenger, setPassenger] = useState(true);
  const [is_driver, setDriver] = useState(false);
  const [load, setLoad] = useState(false);
  const phoneInput = useRef(null);
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const tel = formattedValue;


  return (
    <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 15,
          }}>
          <View style={{}}>
            <Image
              style={{
                width: 190,
                height: 140,
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
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <View
              style={{
                width: width / 1.2,
                backgroundColor: '#EAF0F0',
                height: 45,
                borderRadius: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setPassenger(true)
                  setDriver(false)
                }}
                style={{
                  width: width / 2.4,
                  backgroundColor:
                    is_passenger === true ? '#ff8612' : 'transparent',
                  elevation: is_passenger === true ? 3 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    fontWeight: '700',
                    color: is_passenger === true ? '#ffffff' : '#ff8612',
                    fontSize: 16,
                  }}>
                  Passager
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPassenger(false)
                  setDriver(true)
                }}
                style={{
                  width: width / 2.4,
                  backgroundColor:
                    is_passenger !== true ? '#ff8612' : 'transparent',
                  elevation: is_passenger !== true ? 3 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    fontWeight: '700',
                    color: is_passenger !== true ? '#ffffff' : '#ff8612',
                    fontSize: 16,
                  }}>
                  Chauffeur
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {is_passenger ==true?
            <Passengers />
            :
            <Drivers />
          }
      </View>
    </KeyboardAwareScrollView>
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
