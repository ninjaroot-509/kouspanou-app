import React, { Component, useState } from 'react';
import {
  Button,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import Constants from 'expo-constants';
import { FontAwesome } from 'react-native-vector-icons';
import { setUserSession } from '../Components/Common/Auth/Sessions';
import axios from 'axios';

const Type = ({ toggleSignup, setTypeUser, setPassenger, setDriver, navigation }) => {
  const handlePassenger = () => {
    setTypeUser(true)
    setPassenger(true)
    setDriver(false)
  }
  const handleDriver = () => {
    setTypeUser(true)
    setPassenger(false)
    setDriver(true)
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleSignup}
        style={{
          left: 20,
          backgroundColor: '#ff8612',
          borderRadius: 20,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 3,
        }}>
        <FontAwesome name="arrow-left" size={17} style={{ color: '#fff' }} />
      </TouchableOpacity>
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
        <View
          style={{
            padding: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>choisissez votre type de compte</Text>
        </View>
        <View style={{ padding: 15 }}>
          <TouchableOpacity
            onPress={handlePassenger}
            style={styles.button}>
            <Text style={styles.textType}>Passenger</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDriver}
            style={styles.button}>
            <Text style={styles.textType}>Driver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default Type;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    width: 170,
    height: 55,
    padding: 12,
    borderRadius: 100,
    backgroundColor: '#ff8612',
    marginTop: 20,
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
  textType: {
    color: 'white',
    fontWeight: 'bold',
  },
});
