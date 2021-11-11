import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import {
  getToken,
  getUser,
  getComand,
} from '../Components/Common/Auth/Sessions';
import useUsers from '../src/state/user/hooks/useUsers';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    getToken().then((value) => {
      if (value === null) {
        navigation.replace('OnBoard');
      } else {
        getUser().then((res) => {
          if (res.is_complete === true) {
            if (res.is_passenger === true && res.is_driver === false) {
              getComand().then((valueComd) => {
                if (valueComd === null) {
                  navigation.replace('DrawerNavigationRoutes');
                } else {
                  if (valueComd.is_active === true) {
                    navigation.replace('BidRider');
                  } else {
                    if (valueComd.arrival === true) {
                      navigation.replace('DestRider');
                    } else {
                      navigation.replace('BidRiderTrafic');
                    }
                  }
                }
              });
            } else if (res.is_passenger === false && res.is_driver === true) {
              getComand().then((valueComd) => {
                if (valueComd === null) {
                  navigation.replace('NavigationRoutesDriver');
                } else {
                  if (valueComd.is_active === true) {
                    navigation.replace('BidDriver');
                  } else {
                    if (valueComd.arrival === true) {
                      navigation.replace('DestDriver');
                    } else {
                      navigation.replace('BidDriverTrafic');
                    }
                  }
                }
              });
            } else {
              navigation.replace('Out');
            }
          } else if (res.is_complete === false) {
            navigation.replace('CompleteI');
          } else {
            navigation.replace('SplashScreen');
          }
        });
      }
    });
  });

  return (
    <View style={styles.container}>
      <View style={{padding: 20}}>
        <Image
          style={{
            width: 240,
            height: 240,
          }}
          source={require('../assets/logo.png')}//changement du logo 
        />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
