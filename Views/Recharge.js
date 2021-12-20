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
import { setmergeItemUser, getToken } from '../Components/Common/Auth/Sessions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import request from '../Components/Common/HttpRequests';

import useUsers from '../src/state/user/hooks/useUsers';
import Moncash from './Moncash'


const Recharge = ({ navigation }) => {
  const [montantInput, setMontantInput] = useState('');
  const [load, setLoad] = useState(false);
  const [user, isLoading, setUsers] = useUsers();
  const [modal, setModal] = useState(false);
  const [moncashLink, setMoncashLink] = useState('');

  const togleOpenModal = () => {
    setModal(true)
  }

  const togleCloseModal = () => {
    setModal(false)
  }

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [user, setUsers]);

  const handleSubmit = async () => {
    const token = await getToken()
    if (montantInput != '') {
      if (load === false) {
        setLoad(true);
        const dataBody = JSON.stringify({
          montant: montantInput,
        });
        request.postRecharge(token, dataBody).then((res) => {
          setLoad(false)
          setMoncashLink(res.lien_moncash)
          togleOpenModal()
        }).catch((err) => {
          setLoad(false)
          alert(err)
        });
      }
    } else {
      alert('Entrer votre montant!');
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
      <Moncash togleOpenModal={togleOpenModal} togleCloseModal={togleCloseModal} modal={modal} moncashLink={moncashLink} />
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
              keyboardType={'numeric'}
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
