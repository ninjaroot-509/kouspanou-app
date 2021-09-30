import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from 'react-native-vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import customMapStyle from './mapstyle.json';
import useDriveronlines from '../../src/state/driveronline/hooks/useDriveronlines';
import Modal from 'react-native-modal';
import useUsers from '../../src/state/user/hooks/useUsers';
import request from '../../Components/Common/HttpRequests';
import { setmergeItemUser } from '../../Components/Common/Auth/Sessions';
import useWallets from '../../src/state/wallet/hooks/useWallets';

const MapButton = ({ icon, ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        height: 45,
        backgroundColor: '#fff',
        borderRadius: 22.5,
        marginRight: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
      }}>
      {icon == 'money'?
        <FontAwesome
          name={icon}
          size={22}
          style={{ color: '#ff8612' }}
        />
        :
        <MaterialCommunityIcons
          name={icon}
          size={22}
          style={{ color: '#ff8612' }}
        />
      }
    </TouchableOpacity>
  );
};

const Home1 = ({ navigation }) => {
  const [temp, setTemp] = useState(0);
  const [loadDriver, setLoadDriver] = useState(true);
  const [change, setChange] = useState(false);
  const [modal, setModal] = useState(false);
  const [user, isLoadingUser, setUsers] = useUsers();
  const [wallet, isLoadingW, setWallets] = useWallets();

  useEffect(() => {
    if (!wallet.details || wallet.details.length === 0) {
      setWallets();
    }
  }, [setWallets, wallet]);

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [user, setUsers]);

  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 300000);
  }, []);

  useEffect(() => {
    setLoadDriver(true);
  }, [temp]);

  const [driveronline, isLoading, setListDriveronlines] = useDriveronlines();

  useEffect(() => {
    if (!driveronline.list || driveronline.list.length === 0) {
      if (loadDriver == true) {
        setLoadDriver(false);
        setListDriveronlines();
      }
    }
  }, [driveronline, setListDriveronlines]);

  let mapRef = MapView ? MapView : null;
  const [latLng, setLatLng] = useState({
    latitude: user?.details?.latitude,
    longitude: user?.details?.longitude,
  });

  useEffect(() => {
    Location.installWebGeolocationPolyfill();
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setTimeout(() => {
          request
            .postUserLocation({
              pk: user?.details?.id,
              latitude: latitude,
              longitude: longitude,
            })
            .then((res) => setUsers())
            .catch((err) => {
              console.log("une erreur, Impossible d'obtenir votre position actuelle");
            });
        }, 10000);
        setLatLng({ latitude, longitude });
      },
      () => {
        console.log("une erreur, Impossible d'obtenir votre position actuelle");
      },
      {
        timeout: 2000,
        enableHighAccuracy: true,
        maximumAge: 1000,
      }
    );
  }, []);

  const centerMap = () => {
    mapRef?.animateToRegion(
      {
        ...latLng,
        latitudeDelta: 0.0143,
        longitudeDelta: 0.0134,
      },
      1000
    );
  };

  const handleChange = () => {
    let datauser = {
      is_driver: true,
      is_passenger: false,
    };
    setChange(true);
    if (change !== true) {
      request
        .postUserType({
          pk: user?.details?.id,
          is_driver: true,
          is_passenger: false,
        })
        .then((res) => {
          setmergeItemUser(datauser).then((res) => {
            navigation.replace('SplashScreen');
          });
        })
        .catch((err) => {
          alert('une erreur!', err);
        });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={(map) => {
          mapRef = map;
        }}
        style={styles.map}
        region={{
          ...latLng,
          latitudeDelta: 0.0843,
          longitudeDelta: 0.0134,
        }}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}>
        <MapView.Marker 
          title="votre position" coordinate={latLng} 
          tracksViewChanges={true}
          image={require('../../assets/passager.png')}
          width={5}
          height={5}
        />
        {driveronline?.list?.map((item) => (
          <MapView.Marker
            key={item.id}
            title={item.username}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
          />
        ))}
      </MapView>

      <Modal
        isVisible={modal}
        onRequestClose={() => setModal(false)}
        onBackButtonPress={() => setModal(false)}>
        <View
          style={{
            backgroundColor: 'white',
            height: 200,
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>
              Changer Type compte
            </Text>
          </View>
          <View style={{ padding: 17, alignItems: 'center' }}>
            <Text style={{ textAlign: 'justify' }}>
              Hello {user?.details?.first_name}, Confirmez que vous voulez
              changer votre compte de type passager en type chauffeur.
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                margin: 5,
                backgroundColor: '#cacaca',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                height: 45,
                width: 100,
              }}
              onPress={() => setModal(false)}>
              <Text style={{ color: '#000' }}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleChange}
              style={{
                margin: 5,
                backgroundColor: change === false ? '#ff8612' : '#cacaca',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                height: 45,
                width: 100,
              }}>
              <Text style={{ color: '#fff' }}>Comfirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={{borderRadius: 45,
          position: 'absolute',
          flexDirection: 'row',
          top: 50,
          left: 0,
          marginHorizontal: 15,
          backgroundColor: '#fff',
          padding: 10,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.2,
          shadowRadius: 6.17,
          justifyContent: 'center',
          alignItems: 'center',}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Fontisto
            name="wallet"
            size={18}
            style={{ color: '#ff9612', marginHorizontal: 3 }}
          />
        </View>
        <View style={{ margin: 3 }}>
          <Text style={{ fontSize: 13, color: '#001', fontWeight: 'bold' }}>{wallet?.details?.montant} HTG</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.changeusertype}
        onPress={() => setModal(true)}>
        <View
          style={{
            padding: 5,
            backgroundColor: '#143fff',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons
            name="seat-passenger"
            size={20}
            style={{ color: '#fff' }}
          />
        </View>
        <View style={{ margin: 3 }}>
          <Text style={{ fontSize: 13, color: '#001' }}>Passager</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.box}>
        <View style={{ flexDirection: 'row' }}>
          <MapButton icon={'history'} />
          <MapButton icon={'money'} />
        </View>
        <MapButton icon={'map-marker-radius'} onPress={centerMap} />
      </View>
      <View style={styles.input}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Pickup')}>
          <Text style={{ fontSize: 10, color: '#001' }}>
            Depuis: votre position
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#143FFF',
                marginRight: 10,
              }}
            />
            <Text style={{ fontSize: 18, color: '#ff8612', opacity: 0.9 }}>
              où allez vous!?
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 45,
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 45,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6.17,
  },
  button: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 45,
  },
  changeusertype: {
    borderRadius: 45,
    position: 'absolute',
    flexDirection: 'row',
    top: 50,
    backgroundColor: '#fff',
    padding: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6.17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 110,
    width: '80%',
    height: 50,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
