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
import { Ionicons } from 'react-native-vector-icons';
import { setmergeItemUser } from '../Components/Common/Auth/Sessions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import request from '../Components/Common/HttpRequests';

import useUsers from '../src/state/user/hooks/useUsers';

const Recharge = ({ navigation }) => {
  const [montantInput, setMontantInput] = useState('');
  const [load, setLoad] = useState(false);
  const [user, isLoading, setUsers] = useUsers();

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [user, setUsers]);

  const handleSubmit = async () => {
    if (first_name != '' && montantInput != '') {
      if (load === false) {
        setLoad(true);
        const pk = user?.details?.id;
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify({
          montantInput: montantInput,
        });
        axios
          .post(
            `https://crazy-taxi.quizapay.com/api/depot-user/?pk=${pk}`,
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
      <View style={styles.header}>
        <View style={styles.headertitle}>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="arrow-back"
                  size={26}
                  style={{ color: '#ff8612' }}
                />
              </TouchableOpacity>
          </View>
        </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 10,
          }}>
          <Image
            style={{
              width: 240,
              height: 240,
            }}
            source={require('../assets/logo.png')}
          />
        </View>
        <View style={{alignItems: 'center'}}>
            <Text style={{
            fontWeight: '500',
            color: '#A1A3B0',
            fontSize: 16,
            }}>Recharger mon compte</Text>
        </View>
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{ padding: 20 }}>
            <TextInput
              onChangeText={(montantInput) => setMontantInput(montantInput)}
              value={montantInput}
              placeholder={'Ex: 100 = 100HTG'}
              placeholderTextColor={'#cacaca'}
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
        </View>
      </KeyboardAwareScrollView>
    );
  }
};
export default Recharge;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 10,
  },
  headertitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
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
