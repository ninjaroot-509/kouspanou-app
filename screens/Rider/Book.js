import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import mapstyle from './mapstyle.json';
import Feather from 'react-native-vector-icons/Feather';
import MapViewDirections from 'react-native-maps-directions';
import Svg, { Polygon } from 'react-native-svg';
import request from '../../Components/Common/HttpRequests';
import useUsers from '../../src/state/user/hooks/useUsers';
import useWallets from '../../src/state/wallet/hooks/useWallets';
import customMapStyle from './mapstyle.json';
import {
  getComand,
  setComand
} from '../../Components/Common/Auth/Sessions';
import axios from 'axios';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const API_KEY = 'AIzaSyABvjR0skZrJYvGQVse00YNGo9k5xi8Wyo';

const Book = ({ navigation, route }) => {
  const { params } = route;
  const { zone } = params;

  const [user, isLoading, setUsers] = useUsers();
  const [wallet, isLoadingW, setWallets] = useWallets();
  const [pay, setPay] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [setUsers, user]);

  useEffect(() => {
    if (!wallet.details || wallet.details.length === 0) {
      setWallets();
    }
  }, [setWallets, wallet]);

  const [latLng, setLatLng] = useState({
    latitude: zone.latitude,
    longitude: zone.longitude,
  });

  const handlePayNM = () => {
    setDone(true);
    const pk = user?.details?.id;
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({
      longitude: user?.details?.longitude,
      latitude: user?.details?.latitude,
      destination_id: zone.id,
      payMN: true,
    });
    axios
      .post(
        `https://crazy-taxi.quizapay.com/api/trips/?pk=${pk}`,
        body,
        config
      )
      .then((res) => {
        setTimeout(() => {          
          setComand(res.data).then((i)=> {
            navigation.replace('SplashScreen');
          })
          setDone(false)
        }, 900);
      })
      .catch((err) => {
        alert("une erreur", "une erreur s'est produite, si persiste veuillez nous contacter", err);
        console.log(err)
        setDone(false)
      })
  };

  const handlePay = () => {
    setDone(true);
    const pk = user?.details?.id;
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({
      longitude: user?.details?.longitude,
      latitude: user?.details?.latitude,
      destination_id: zone.id,
      payMN: false,
    });
    axios
      .post(
        `https://crazy-taxi.quizapay.com/api/trips/?pk=${pk}`,
        body,
        config
      )
      .then((res) => {
        setTimeout(() => {          
          setComand(res.data).then((i)=> {
            navigation.replace('SplashScreen');
          })
          setDone(false)
        }, 900);
      })
      .catch((err) => {
        alert("une erreur", "une erreur s'est produite, si persiste veuillez nous contacter", err);
        console.log(err)
        setDone(false)
      })
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        region={{
          ...latLng,
          latitudeDelta: 0.6,
          longitudeDelta: 0.6,
        }}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}>
        <MapView.Marker title="votre destination" coordinate={latLng} />
        <MapView.Marker
          title="votre position"
          coordinate={{
            latitude: user?.details?.latitude
              ? user?.details?.latitude
              : 18.652248,
            longitude: user?.details?.longitude
              ? user?.details?.longitude
              : -72.2949,
          }}
        />
      </MapView>

      <View
        style={{
          position: 'absolute',
          flex: 1,
        }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Feather name="x" size={24} style={styles.iconBlack} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      <View
        style={{
          position: 'absolute',
          width,
          bottom: 0,
        }}>
        {done ? (
          <View
            style={{
              backgroundColor: '#fff',
              alignItems: 'center',
              paddingHorizontal: 40,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                color: '#001',
                fontSize: 17,
                fontWeight: '500',
                marginBottom: 10,
              }}>
              recherche en cours..
            </Text>
            <View
              style={{
                flex: 1,
              }}>
              <ActivityIndicator
                animating={done}
                color="#ff8612"
                size="large"
                style={{ alignItems: 'center' }}
              />
            </View>
          </View>
        ) : (
          <>
            <View
              style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                paddingHorizontal: 40,
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  color: '#8a8c95',
                  fontSize: 20,
                  fontWeight: '500',
                  marginBottom: 10,
                }}>
                {zone.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={{ fontWeight: 'bold', color: '#8a8c95' }}>
                  Note:{' '}
                </Text>
                <Text style={{ color: '#8a8c95' }}>
                  Ceci est une estimation approximative, à partir de votre
                  emplacement actuel et de votre destination finale, veuillez
                  choisir votre moyen de paiement tout en bas!
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={handlePay}
                style={{
                  backgroundColor: '#e9e9eb',
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  width: width / 2,
                  alignItems: 'center',
                  borderRightColor: '#f5f5f6',
                  borderRightWidth: 1,
                }}>
                <Text
                  style={{
                    color: pay ? '#cacaca' : '#003',
                    fontSize: 13,
                    fontWeight: '500',
                  }}>
                  Portefeuille
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePayNM}
                style={{
                  backgroundColor: '#e9e9eb',
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  width: width / 2,
                  alignItems: 'center',
                  borderLeftColor: '#f5f5f6',
                  borderLeftWidth: 1,
                }}>
                <Text
                  style={{
                    color: pay ? '#cacaca' : '#003',
                    fontSize: 13,
                    fontWeight: '500',
                  }}>
                  Payer Cash
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    width: width - 40,
    paddingTop: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBlack: {
    color: '#525361',
  },
  map: {
    width: '100%',
    height: '70%',
  },
});

export default Book;
