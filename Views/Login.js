import React, { Component, useState, useEffect, useRef } from 'react';
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
  ActivityIndicator
} from 'react-native';
import Constants from 'expo-constants';
import { FontAwesome } from 'react-native-vector-icons';
import { setUserSession } from '../Components/Common/Auth/Sessions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import PhoneInput from 'react-native-phone-number-input';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import request from '../Components/Common/HttpRequests';

const Login = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoad] = useState(false);
  const phoneInput = useRef(null);
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const tel = formattedValue;

  const handleLoginSubmit = async () => {
    if (phone != '' && password != '') {
      if (load === false) {
        setLoad(true);
        const dataBody = JSON.stringify({ phone: tel, password: password });
        request.postHandleLogin(dataBody).then((res) => {
            setUserSession(res.token, res.user).then((res) => {
              navigation.replace('SplashScreen');
            }); // LOGIN OK redirect
            setLoad(false);
          })
          .catch((err) => {
            console.warn(err);
            alert(err);
            setLoad(false);
          });
      }
    } else {
      alert('vous devez remplir tout les champs!');
    }
  };

  return (
    <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <View style={{}}>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 25,
            }}>
            <View style={{}}>
              <Image
                style={{
                  width: 200,
                  height: 140,
                }}
                source={require('../assets/logo.png')}
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#001' }}>
                Connexion
              </Text>
              <Text style={{ fontSize: 17, color: '#001' }}>
                Hello, bon retour
              </Text>
              <Text style={{ fontSize: 17, color: '#001' }}>
                Content de te revoir!
              </Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
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
              textContainerStyle={{ borderRadius: 7 }}
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
            <View style={{ alignSelf: 'flex-end', padding: 8, paddingTop: 10 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#ff9612',
                  textAlign: 'right',
                  textDecorationLine: 'underline',
                }}>
                Mot de passe oublié
              </Text>
            </View>
          </View>
          <View style={{ padding: 7 }}>
          <TouchableOpacity
          style={styles.button}
          onPress={handleLoginSubmit}>
          {load === false ? (
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Connecter
            </Text>
          ) : (
              <ActivityIndicator
                color="#ffffff"
                size="small"
                style={{ alignItems: 'center' }}
              />
          )}
        </TouchableOpacity>
          </View>
          <View style={{ padding: 7 }}>
            <TouchableOpacity onPress={() => navigation.replace('Signup')}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#001',
                  textDecorationLine: 'underline',
                  textAlign: 'center',
                }}>
                Inscrivez-vous!?
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ justifyContent: 'center' }}>
                <View
                  style={{
                    borderBottomWidth: 1.5,
                    width: 60,
                    borderColor: '#143fff',
                  }}
                />
              </View>
              <View style={{ padding: 7, alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#001',
                  }}>
                  or
                </Text>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <View
                  style={{
                    borderBottomWidth: 1.5,
                    width: 60,
                    borderColor: '#143fff',
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 7,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                  elevation: 4
                }}>
                <FontAwesome name="google" size={22} color="#143fff" />
              </View>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 7,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                  elevation: 4
                }}>
                <FontAwesome name="facebook" size={22} color="#143fff" />
              </View>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 7,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                  elevation: 4
                }}>
                <FontAwesome name="twitter" size={22} color="#143fff" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
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
    height: 44,
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
