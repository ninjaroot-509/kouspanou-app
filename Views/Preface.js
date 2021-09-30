import React, { Component, useState } from 'react';
import {
  Text,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Image,
  StyleSheet,
  Button
} from 'react-native';
import { setUserSession } from '../Components/Common/Auth/Sessions';
import Login from './Login';
import Signup from './Signup';
import axios from 'axios';

const Preface = ({ navigation }) => {
  const [modalLoginVisible, setmodalLoginVisible] = useState(false);
  const [modalSignupVisible, setmodalSignupVisible] = useState(false);
  const toggleLogin = () => {
    if (modalLoginVisible === true) {
      setmodalLoginVisible(false);
    } else {
      setmodalLoginVisible(true);
    }
  };
  const toggleSignup = () => {
    if (modalSignupVisible === true) {
      setmodalSignupVisible(false);
    } else {
      setmodalSignupVisible(true);
    }
  };
  return (
    <View style={styles.container}>
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={modalLoginVisible}>
        <Login toggleLogin={toggleLogin} navigation={navigation} />
      </Modal>
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={modalSignupVisible}>
        <Signup toggleSignup={toggleSignup} navigation={navigation} />
      </Modal>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          top: 60,
          width: 100,
          height: 125,
        }}>
        <Image
          style={{
            width: 250,
            height: 250,
            elevation: 1,
          }}
          source={require('../assets/logo.png')}
        />
      </View>
      <View style={{ flex: 1, top: 65 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            toggleSignup();
          }}>
          <Text style={{ color: '#ff8612', fontSize: 20, fontWeight: '500' }}>
            S'inscrire
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            toggleLogin();
          }}>
          <Text
            style={{ color: '#fff', fontSize: 20, fontWeight: '500' }}>
            Connecter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Preface;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    width: 270,
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#ff8612',
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button1: {
    width: 270,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff8612',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1.2,
  },
});
