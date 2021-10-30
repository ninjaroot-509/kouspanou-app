import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  AsyncStorage,
  Text,
} from 'react-native';
import {
  getToken,
  getUser,
  getComand,
} from '../Components/Common/Auth/Sessions';
import useUsers from '../src/state/user/hooks/useUsers';

const SplashScreen = ({ navigation }) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setAnimating(false);
    //Check if user_id is set or not
    //If not then send for Authentication
    //else send to Home Screen Auth
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
                      navigation.replace('DestRriver');
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
      <ActivityIndicator
        animating={animating}
        color="#ff8612"
        size="large"
        style={{ alignItems: 'center' }}
      />
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
