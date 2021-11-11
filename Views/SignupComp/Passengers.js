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
} from 'react-native';
import Constants from 'expo-constants';
import { FontAwesome } from 'react-native-vector-icons';
import { setUserSession } from '../../Components/Common/Auth/Sessions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import PhoneInput from 'react-native-phone-number-input';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';

const Signup = () => {
  const navigation = useNavigation();
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

  const handleSignupSubmit = () => {
    if (load === false) {
      setLoad(true);
      if (phone === '' || password === '' || password2 === '') {
        alert('Remplissez tous les champs!');
        setLoad(false);
      } else if (password !== password2) {
        alert('Les mots de passe ne correspondent pas!');
        setLoad(false);
      } else {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify({
          phone: tel,
          password,
          is_driver,
          is_passenger,
        });
        axios
          .post(
            'https://crazy-taxi.quizapay.com/api/auth/register',
            body,
            config
          )
          .then((res) => {
            setUserSession(res.data.token, res.data.user); // Signup OK redirect
            console.log('Bienvenue ' + '' + res.data.user.phone);
            navigation.replace('SplashScreen');
          })
          .catch((err) => {
            setLoad(false);
            console.log(err);
          });
      }
    }
  };

  return (
    <View style={{ alignItems: 'center', padding: 15, paddingBottom: 30 }}>
      <View style={{ padding: 5 }}>
        <Text style={{ fontSize: 13, color: '#001', padding: 7 }}>
          Telephone
        </Text>
        <PhoneInput
          containerStyle={{
            width: 300,
            height: 50,
            borderRadius: 7,
          }}
          withShadow
          ref={phoneInput}
          defaultValue={phone}
          defaultCode="HT"
          layout="first"
          onChangeText={(text) => {
            setPhone(text);
          }}
          onChangeFormattedText={(text) => {
            setFormattedValue(text);
          }}
          // autoFocus
        />
      </View>
      <View style={{ padding: 5 }}>
        <Text style={{ fontSize: 13, color: '#001', padding: 7 }}>
          Mot de passe
        </Text>
        <TextInput
          onChangeText={(password) => setPassword(password)}
          value={password}
          placeholder={'Entrer votre mot de passe'}
          placeholderTextColor={'#cacaca'}
          secureTextEntry={true}
          style={styles.input}
          returnKeyType="next"
        />
      </View>
      <View style={{ padding: 5 }}>
        <Text style={{ fontSize: 13, color: '#001', padding: 7 }}>
          Comfirmation du mot de passe
        </Text>
        <TextInput
          onChangeText={(password2) => setPassword2(password2)}
          value={password2}
          placeholder={'Comfirmer votre mot de passe'}
          placeholderTextColor={'#cacaca'}
          secureTextEntry={true}
          style={styles.input}
          returnKeyType="next"
        />
      </View>
      <View style={{ padding: 7, paddingTop: 14 }}>
        {load === false ? (
          <TouchableOpacity style={styles.button} onPress={handleSignupSubmit}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              S'inscrire
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.button1}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              S'inscrire
            </Text>
          </View>
        )}
      </View>
      <View style={{ padding: 3 }}>
        <TouchableOpacity onPress={() => navigation.replace('Auth')}>
          <Text
            style={{
              fontSize: 15,
              color: '#143fff',
              textDecorationLine: 'underline',
              textAlign: 'center',
            }}>
            Se connecter!?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Signup;

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 50,
    padding: 12,
    borderRadius: 7,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  button: {
    width: 300,
    height: 50,
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#ff8612',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  button1: {
    width: 300,
    height: 50,
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#cacaca',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});
