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
} from 'react-native';
import Constants from 'expo-constants';
import { FontAwesome } from 'react-native-vector-icons';
import { setmergeItemUser } from '../Components/Common/Auth/Sessions';
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
    if (first_name != '' && last_name != '') {
      if (load === false) {
        setLoad(true);
        const pk = user?.details?.id;
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify({
          last_name: last_name,
          first_name: first_name,
        });
        axios
          .post(
            `https://crazy-taxi.quizapay.com/api/info-user/?pk=${pk}`,
            body,
            config
          )
          .then((res) => {
            setmergeItemUser(res.data).then((i) => {
              setUsers();
              navigation.replace('SplashScreen');
              console.log('Bienvenue ' + res.data.user.first_name);
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
      <View style={styles.container}>
        <ActivityIndicator
          color="#ff8612"
          size="large"
          style={{ alignItems: 'center' }}
        />
      </View>
    );
  } else {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}>
          <Image
            style={{
              width: 240,
              height: 240,
            }}
            source={require('../assets/logo.png')}
          />
        </View>
        <View>
          <View style={{ padding: 20 }}>
            <TextInput
              onChangeText={(last_name) => setLastName(last_name)}
              value={last_name}
              placeholder={'Entrer Votre Nom'}
              placeholderTextColor={'#ff8612'}
              style={styles.input}
              returnKeyType="next"
            />
            <TextInput
              onChangeText={(first_name) => setFirstName(first_name)}
              value={first_name}
              placeholder={'Entrez Votre Prenom'}
              placeholderTextColor={'#ff8612'}
              style={styles.input}
              returnKeyType="next"
            />
          </View>
          <View style={{ padding: 20 }}>
            {load === false ? (
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Continuer
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.button1}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Continuer
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
};
export default CompleteI;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: 270,
    height: 44,
    padding: 12,
    borderRadius: 25,
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
    width: 270,
    height: 44,
    padding: 12,
    borderRadius: 25,
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
    width: 270,
    height: 44,
    padding: 12,
    borderRadius: 25,
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
