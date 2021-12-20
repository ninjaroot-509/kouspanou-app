import React, { Component, useState, useEffect } from 'react';
import {
  Button,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Constants from 'expo-constants';
import { FontAwesome } from 'react-native-vector-icons';
import { setmergeItemUser, getToken } from '../Components/Common/Auth/Sessions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import request from '../Components/Common/HttpRequests';

import useUsers from '../src/state/user/hooks/useUsers';

const CompleteI = ({ navigation }) => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [load, setLoad] = useState(false);
  const [user, isLoading, setUsers] = useUsers();

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [user, setUsers]);

  const handleSubmit = async () => {
    const token = await getToken()
    if (first_name != '' && last_name != '') {
      if (load === false) {
        setLoad(true);
        const dataBody = JSON.stringify({
          last_name: last_name,
          first_name: first_name,
        });
        request.postUserInfoStart(token, dataBody).then((res) => {
            setmergeItemUser(res.data).then((i) => {
              setUsers();
              navigation.replace('SplashScreen');
              setLoad(false);
            });
          })
          .catch((err) => {
            alert(err);
            setLoad(false);
          });
      }
    } else {
      alert('Nom ou Prenom manquant!');
    }
  };

  if (isLoading === true) {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
        <ActivityIndicator
          color="#ff8612"
          size="large"
          style={{ alignItems: 'center' }}
        />
      </View>
    );
  } else {
    return (
      <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 40,
          }}>
          <Image
            style={{
              width: 240,
              height: 240,
            }}
            source={require('../assets/logo.png')}
          />
        </View>
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{ padding: 20 }}>
            <TextInput
              onChangeText={(last_name) => setLastName(last_name)}
              value={last_name}
              placeholder={'Entrer Votre Nom'}
              placeholderTextColor={'#cacaca'}
              style={styles.input}
              returnKeyType="next"
            />
            <TextInput
              onChangeText={(first_name) => setFirstName(first_name)}
              value={first_name}
              placeholder={'Entrez Votre Prenom'}
              placeholderTextColor={'#cacaca'}
              style={styles.input}
              returnKeyType="next"
            />
          </View>
          <View style={{ padding: 20 }}>
          <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}>
          {load === false ? (
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Continuer
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
        </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
};
export default CompleteI;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: width / 1.2,
    height: 50,
    padding: 12,
    borderRadius: 7,
    marginTop: 15,
    backgroundColor: '#fff',
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
  button: {
    width: width / 1.2,
    height: 50,
    padding: 12,
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
    width: width / 1.2,
    height: 44,
    padding: 12,
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
