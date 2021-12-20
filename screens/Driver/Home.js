import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  TouchableHighlight,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';
import { Card } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';
import Modal from 'react-native-modal';
import useUsers from '../../src/state/user/hooks/useUsers';
import request from '../../Components/Common/HttpRequests';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  setmergeItemUser,
  getToken,
} from '../../Components/Common/Auth/Sessions';
import customMapStyle from '../Rider/mapstyle.json';
import useWallets from '../../src/state/wallet/hooks/useWallets';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { getComand, setComand } from '../../Components/Common/Auth/Sessions';

const { width, height } = Dimensions.get('window');
Geocoder.init('AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc');
const Home = ({ navigation }) => {
  const [demande, setDemande] = useState([]);
  const [temp, setTemp] = useState(0);
  const [change, setChange] = useState(false);
  const [modal, setModal] = useState(false);
  const [positionDone, setPositionDone] = useState(false);
  const [user, isLoadingUser, setUsers] = useUsers();
  const [wallet, isLoadingW, setWallets] = useWallets();
  const API_KEY = 'AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc';
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!wallet.details || wallet.details.length === 0) {
      setWallets();
    }
  }, [setWallets, wallet]);

  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 60000);
  }, []);

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [user, setUsers]);

  useEffect(() => {
    getrealTime();
  }, [temp]);

  const getrealTime = () => {
    request.getDemande().then((res) => {
      setDemande(res);
    });
  };

  const [latLng, setLatLng] = useState({
    latitude: user?.details?.latitude,
    longitude: user?.details?.longitude,
  });

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const token = await getToken();
    Location.installWebGeolocationPolyfill();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position.length !== 0) {
          setPositionDone(true);
          const latitudeInfo = position.coords.latitude;
          const longitudeInfo = position.coords.longitude;
          Geocoder.from(latitudeInfo, longitudeInfo).then((resName) => {
            const place_nameInfo = resName.results[0].formatted_address;
            const dataBody = new FormData();
            dataBody.append('latitude', latitudeInfo);
            dataBody.append('longitude', longitudeInfo);
            dataBody.append('place_name', place_nameInfo);
            request
              .postUserLocation(token, dataBody)
              .then((res) => {
                console.log('localisation Done!!');
                setUsers();
              })
              .catch((err) => {
                console.log(
                  "une erreur, Impossible d'envoyer les donnees require!"
                );
              });
            // request.postUserOnline(token);
            // setLatLng( latitudeInfo,longitudeInfo );
          });
        }
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
  };
  const renderFooter = () => {
    if (demande.length != 0) {
      return (
        <View style={{ alignItems: 'center', padding: 10 }}>
          <TouchableOpacity
            // activeOpacity={0.9}
            onPress={() => getrealTime}
            //On Click of button load more data
            style={styles.loadMoreBtn}>
            <Text style={styles.btnText}>Voir Plus</Text>
          </TouchableOpacity>
          <View style={{ height: 15 }} />
        </View>
      );
    } else {
      return null;
    }
  };
  const handleChange = async () => {
    const token = await getToken();
    const dataBody = new FormData();
    dataBody.append('is_driver',0);
    dataBody.append('is_passenger',1);
    let datauser = {
      is_driver: false,
      is_passenger: true,
    };
    setChange(true);
    if (change !== true) {
      request
        .postUserType(token, dataBody)
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
  if (positionDone && user?.details?.latitude) {
    return (
      <>
        <View style={styles.container}>
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
                <Text
                  style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>
                  Changer Type compte
                </Text>
              </View>
              <View
                style={{
                  padding: 15,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                  width: 300,
                }}>
                <Text style={{ textAlign: 'center' }}>
                  Hello {user?.details?.first_name}, Confirmez que vous voulez
                  changer votre compte de type chauffeur en type passager.
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
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                borderRadius: 45,
                flexDirection: 'row',
                marginHorizontal: 15,
                backgroundColor: '#fff',
                padding: 10,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2,
                shadowRadius: 6.17,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
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
                <Text
                  style={{ fontSize: 13, color: '#001', fontWeight: 'bold' }}>
                  {wallet?.details?.montant} HTG
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderRadius: 45,
                flexDirection: 'row',
                marginHorizontal: 15,
                backgroundColor: '#fff',
                padding: 6,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2,
                shadowRadius: 6.17,
                justifyContent: 'center',
                alignItems: 'center',
              }}
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
                  name="van-passenger"
                  size={20}
                  style={{ color: '#fff' }}
                />
              </View>
              <View style={{ margin: 3 }}>
                <Text style={{ fontSize: 13, color: '#001' }}>Chauffeur</Text>
              </View>
            </TouchableOpacity>
          </View>
          {user?.details?.kous.kous >= 1 ? (
            <ScrollView>
              <FlatList
                style={{ paddingVertical: 20 }}
                horizontal={false}
                data={demande}
                keyExtractor={({ key }, index) => key}
                enableEmptySections={true}
                ListFooterComponent={renderFooter}
                renderItem={({ item }) => {
                  return (
                    <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                      <Card style={styles.box}>
                        <View style={{ alignItems: 'center' }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              padding: 12,
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingLeft: 8
                              }}>
                              <FontAwesome
                                name="map-marker"
                                size={22}
                                style={{ color: '#ff8612' }}
                              />
                              <View
                                style={{
                                  marginHorizontal: 2,
                                  width: width / 1.9,
                                }}>
                                <Text
                                  style={{ opacity: 0.8 }}
                                  numberOfLines={1}>
                                  {item.client_position_name}
                                </Text>
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                              }}>
                              <View
                                style={{
                                  marginHorizontal: 5,
                                  width: 100,
                                  alignItems: 'center',
                                }}>
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    color: '#ff8612',
                                    fontWeight: '500',
                                  }}>
                                  {moment(item.created_on).fromNow()}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <MapView
                            style={{
                              width: 320,
                              height: 150,
                              justifyContent: 'center',
                              alignSelf: 'center',
                              borderRadius: 10,
                            }}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                              latitude: item.client_latitude,
                              longitude: item.client_longitude,
                              latitudeDelta: LONGITUDE_DELTA,
                              longitudeDelta: LONGITUDE_DELTA,
                            }}
                            customMapStyle={customMapStyle}>
                            <MapViewDirections
                              lineDashPattern={[0]}
                              origin={{
                                latitude: item.client_latitude,
                                longitude: item.client_longitude,
                              }}
                              destination={{
                                latitude: item.destination_latitude,
                                longitude: item.destination_longitude,
                              }}
                              apikey={API_KEY}
                              strokeWidth={3}
                              strokeColor="#143fff"
                              optimizeWaypoints={true}
                            />
                            <Marker
                              coordinate={{
                                latitude: item.client_latitude,
                                longitude: item.client_longitude,
                              }}
                              title={'Position actuelle du client'}
                            />
                            <Marker
                              coordinate={{
                                latitude: item.destination_latitude,
                                longitude: item.destination_longitude,
                              }}
                              title={'Destination du client'}
                            />
                          </MapView>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              padding: 8,
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                }}>
                                <MaterialCommunityIcons
                                  name="cash-marker"
                                  size={22}
                                  style={{ color: '#ff8612' }}
                                />
                                <View style={{ paddingHorizontal: 3 }}>
                                  <Text style={{ opacity: 0.8 }}>
                                    {item.is_peye_nan_men === true
                                      ? 'Paiement en cash'
                                      : 'Paiement via portefeuille'}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={{ paddingHorizontal: 3 }}>
                              <TouchableOpacity
                                onPress={() =>
                                  setComand(item).then((res) =>
                                    navigation.replace('SplashScreen')
                                  )
                                }
                                style={{
                                  padding: 8,
                                  backgroundColor: '#ff8612',
                                  borderRadius: 20,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text style={{ color: '#fff', fontSize: 15 }}>
                                  Envoyer un prix
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </Card>
                    </View>
                  );
                }}
              />
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ paddingVertical: 15, paddingHorizontal: 30 }}>
                  <Text
                    style={{
                      color: '#999999',
                      fontWeight: '500',
                      fontSize: 17,
                      textAlign: 'center',
                    }}>
                    hello {user?.details?.first_name}, {''} vous n'avez plus de
                    kous pour effectuer les voyages
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddKous')}
                  style={{
                    backgroundColor: '#ff8612',
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    elevation: 3,
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: 14,
                    }}>
                    Ajouter kous
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator
          color="#ff8612"
          size="large"
          style={{ alignItems: 'center' }}
        />
      </View>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
    paddingTop: Constants.statusBarHeight,
  },
  box: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    width: width / 1.1,
    borderRadius: 20,
    shadowColor: '#ff8612',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 5,
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#ff8612',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  changeusertype: {
    borderRadius: 45,
    flexDirection: 'row',
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
});
