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
import Geocoder from 'react-native-geocoding';
Geocoder.init('AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc');
const { width, height } = Dimensions.get('window');

const Book = ({ navigation, route }) => {
  const { params } = route;
  const { zone } = params;

  const [user, isLoading, setUsers] = useUsers();
  const [wallet, isLoadingW, setWallets] = useWallets();
  const [pay, setPay] = useState(false);
  const [done, setDone] = useState(false);
  const API_KEY = 'AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc';
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
    latitude: zone.item.geometry.location.lat,
    longitude: zone.item.geometry.location.lng,
  });

  const handlePayNM = () => {
    setDone(true);
    const pk = user?.details?.id;
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({
      place_name: zone.item.formatted_address,
      longitude: zone.item.geometry.location.lng,
      latitude: zone.item.geometry.location.lat,
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
      place_name: zone.item.formatted_address,
      longitude: zone.item.geometry.location.lng,
      latitude: zone.item.geometry.location.lat,
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
          latitude: user?.details?.latitude
            ? user?.details?.latitude
            : 18.652248,
          longitude: user?.details?.longitude
            ? user?.details?.longitude
            : -72.2949,
          latitudeDelta: LONGITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}>
          <MapViewDirections
              origin={{
                latitude: user?.details?.latitude
                  ? user?.details?.latitude
                  : 18.652248,
                longitude: user?.details?.longitude
                  ? user?.details?.longitude
                  : -72.2949,
              }}
              destination={latLng}
              apikey={API_KEY}
              strokeWidth={3}
              strokeColor="#143fff"
              optimizeWaypoints={true}
            />
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
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{width: 35, height: 35, backgroundColor: '#ff8612', alignItems: 'center', justifyContent: 'center', borderRadius: 50, elevation: 4}}>
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
              <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 100
              }}>
              <ActivityIndicator
                animating={done}
                color="#ff8612"
                size="large"
                style={{ alignItems: 'center' }}
              />
            </View>
            <Text
              style={{
                color: '#001',
                fontSize: 17,
                fontWeight: '500',
                marginBottom: 35,
              }}>
              recherche en cours..
            </Text>
            
          </View>
        ) : (
          <>
            <View
              style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                paddingHorizontal: 40,
                paddingVertical: 15,
              }}>
              <Text
                style={{
                  color: '#ff8612',
                  fontSize: 20,
                  fontWeight: '500',
                  marginBottom: 10,
                }}>
                {zone.item.formatted_address}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={{ fontWeight: 'bold', color: '#ff8612' }}>
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
                  paddingVertical: 15,
                  width: width / 2,
                  alignItems: 'center',
                  borderRightColor: '#f5f5f6',
                  borderRightWidth: 1,
                  elevation: 2
                }}>
                <Text
                  style={{
                    color: pay ? '#cacaca' : '#000',
                    opacity: 0.7,
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
                  paddingVertical: 15,
                  width: width / 2,
                  alignItems: 'center',
                  borderLeftColor: '#f5f5f6',
                  borderLeftWidth: 1,
                  elevation: 2
                }}>
                <Text
                  style={{
                    color: pay ? '#cacaca' : '#000',
                    opacity: 0.7,
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
    paddingTop: 12
  },
  iconBlack: {
    color: '#fff',
  },
  map: {
    width: '100%',
    height: '70%',
  },
});

export default Book;
