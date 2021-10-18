import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Platform,
  SafeAreaView,
} from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { decode } from '@mapbox/polyline';
import { FontAwesome } from 'react-native-vector-icons';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import customMapStyle from './mapstyle.json';

const getDirections = async (startLoc, destinationLoc) => {
  try {
    const KEY = 'AIzaSyC_C7iEW9aKj93585JSNgZgdsgR8kBihcI';
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`
    );
    let respJson = await resp.json();
    let points = decode(respJson.routes[0].overview_polyline.points);
    let coords = points.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1],
      };
    });
    return coords;
  } catch (error) {
    return error;
  }
};

const App = () => {
  const [coords, setCoords] = useState([]);
  const [dropoff, setDropoff] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalInput, setModalInput] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  });

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    getDirections('52.5200066,13.404954', '50.1109221,8.6821267')
      .then((coords) => setCoords(coords))
      .catch((err) => console.log('Something went wrong'));
  });

  // {coords.length > 0 && <Polyline coordinates={coords} />}

  const showInput = () => {
    if (!isModalInput) {
      setModalInput(true);
    } else {
      setModalInput(false);
    }
  };

  return (
    <>
      {isModalInput === true ? (
        <AutoComplete
          showInput={showInput}
          dropoff={dropoff}
          setDropoff={setDropoff}
        />
      ) : (
        <>
          <SafeAreaView style={{ flex: 1 }}>
            {location ? (
              <MapView
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                initialRegion={location}></MapView>
            ) : (
              <MapView
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                // showsUserLocation={true}
                customMapStyle={customMapStyle}
                initialRegion={{
                  latitude: 18.5138,
                  longitude: -72.2882,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}></MapView>
            )}
          </SafeAreaView>

          <Modal
            isVisible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
            onBackButtonPress={() => setModalVisible(false)}>
            <View
              style={{
                backgroundColor: 'white',
                height: 200,
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <View style={{ marginTop: 20 }}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>
                  Verification
                </Text>
              </View>
              <View style={{ padding: 20, width: 200, alignItems: 'center' }}>
                <Text>
                  Comfirmez que vous etes effectivement pickup que vous voulez
                  aller a {dropoff}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={{
                    padding: 8,
                    backgroundColor: '#cacaca',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    margin: 15,
                  }}
                  onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#000' }}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 8,
                    backgroundColor: '#ff8612',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    margin: 15,
                  }}>
                  <Text style={{ color: '#fff' }}>Continuer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={styles.location}>
            <TouchableOpacity
              // onPress={positionUser}
              style={{
                backgroundColor: '#ff8612',
                borderRadius: 20,
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 3,
              }}>
              <FontAwesome name="user" size={17} style={{ color: '#fff' }} />
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 20,
                    fontWeight: '500',
                    opacity: 0.8,
                  }}>
                  où allez vous?
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                }}>
                <TouchableOpacity
                  style={styles.input}
                  onPress={showInput}
                  activeOpacity={0.1}>
                  <Text style={{ color: '#999999' }}>Petion-ville</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                }}>
                <TouchableOpacity style={styles.button}>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    Rechercher
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 270,
    height: 50,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  button: {
    width: 270,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#ff8612',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  box: {
    position: 'absolute',
    height: 175,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  location: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 20,
    paddingTop: 40,
  },
});
