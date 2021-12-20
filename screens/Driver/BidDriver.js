import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  TextInput,
  AsyncImage,
  Text,
  SearchBar,
  Alert,
  Platform,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import { FontAwesome } from 'react-native-vector-icons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { Feather } from 'react-native-vector-icons';
import Constants from 'expo-constants';
import { FontAwesome5 } from 'react-native-vector-icons';
import { Ionicons } from 'react-native-vector-icons';
import { Entypo } from 'react-native-vector-icons';
// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import request from '../../Components/Common/HttpRequests';
import {
  getUser,
  getToken,
  getComand,
  removeComand,
  setmergeItemComand,
} from '../../Components/Common/Auth/Sessions';
import axios from 'axios';

import useUsers from '../../src/state/user/hooks/useUsers';
import useWallets from '../../src/state/wallet/hooks/useWallets';
import useBidDetails from '../../src/state/biddetail/hooks/useBidDetails';
import Modal from 'react-native-modal';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import customMapStyle from '../Rider/mapstyle.json';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const BidDriver = ({ navigation, route }) => {
  const [user, isLoading, setUsers] = useUsers();
  const [wallet, isLoadingW, setWallets] = useWallets();
  const [biddetail, isLoadingB, setBidDetails] = useBidDetails();
  const [stop, setStop] = useState(false);
  const [temp, setTemp] = useState(0);
  const pk = user?.details?.id;
  const [prix, setPrix] = useState('');
  const [send, setSend] = useState(false);
  const [sendLoad, setSendLoad] = useState(false);
  const [bid, setBid] = useState([]);
  const [userWinModal, setUserWinModal] = useState(false);
  const [userAccept, setUserAccept] = useState(false);
  const [userClickAccept, setUserClickAccept] = useState(false);
  const [userAcceptDone, setUserAcceptDone] = useState(false);
  const API_KEY = 'AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc';
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const { height, width } = Dimensions.get('window');

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [setUsers, user]);

  useEffect(() => {
    if (!stop) {
      setBidDetails();
      if (biddetail?.details || biddetail?.details?.length !== 0) {
        setStop(true);
      }
    }
  }, [setBidDetails, biddetail]);

  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 5000);
  }, []);

  useEffect(() => {
    if (biddetail?.details || biddetail?.details?.length !== 0) {
      request.getBidPrix(pk, biddetail?.details?.id).then((res) => {
        setBid(res);
        setSendLoad(false);
      }).catch(function (error) {
        if (error.response.status === 404) {
          // Request made and server responded
          handleQuit()
        } else {
          alert('an error occured!')
        }
      });
    }

      getClientInfo()
      getDriverBidChoose()
      
  }, [temp]);

  const getClientInfo = async () => {
    const token = await getToken()
    request.getClientInfo(token, biddetail?.details?.id).then((res) => {
      if (res.is_win == true) {
        setUserWinModal(true);
        setUserAcceptDone(true);
      }
    }).catch(function (error) {
      if (error.response.status === 404) {
        // Request made and server responded
        handleQuit()
      } else {
        alert('an error occured!')
      }
    });
}

const getDriverBidChoose = async () => {
  const token = await getToken()
    request.getDriverBidChoose(token, biddetail?.details?.id).then((res) => {
      if (res.bid_active === false) {
        handleQuit()
      }
    }).catch(function (error) {
      if (error.response.status === 404) {
        // Request made and server responded
        handleQuit()
      } else {
        alert('an error occured!')
      }
    });
}

  

  const handleSubmitPrix = async () => {
    const token = await getToken()
    if (
      biddetail?.details &&
      prix &&
      send == false &&
      userAcceptDone == false
    ) {
      setSend(true);
      if (biddetail?.details?.client === pk) {
        const dataBody = JSON.stringify({
          id_trip: biddetail?.details?.id,
          prix: prix,
        });
        request.postUserInstruction(token, dataBody).then((res) => {
            setPrix('');
            setSend(false);
          })
          .catch((err) => {
            alert("une erreur s'est produite");
            setPrix('');
            setSend(false);
          });
      } else {
        setUserAccept(true);
        const dataBody = JSON.stringify({
          id_trip: biddetail?.details?.id,
          prix: prix,
        });
        request.postDriverPrix(token, dataBody).then((res) => {
            setPrix('');
            setSend(false);
          })
          .catch((err) => {
            alert("une erreur s'est produite");
            setPrix('');
            setSend(false);
          });
      }
    }
  };

  const handleQuit = async () => {
    const token = await getToken()
    const dataBody = JSON.stringify({
      id_trip: biddetail?.details?.id,
    });
    request.postQuitDriverBid(token, dataBody).then((res) => {
        removeComand().then((suc) => {
          navigation.replace('SplashScreen');
        });
      }).catch(function (error) {
        if (error.response.status === 404) {
          // Request made and server responded
          removeComand().then((suc) => {
            navigation.replace('SplashScreen');
          });
        }    
      });
  };

  const handleAcceptPost = async () => {
    const token = await getToken()
    const datatrip = {
      is_active: false,
      arrival: false,
      complete: false,
      driver: pk,
      client: biddetail?.details?.client,
      driver_latitude: user?.details?.driver_latitude,
      driver_longitude: user?.details?.driver_longitude,
    };
    const dataBody = JSON.stringify({
      id_trip: biddetail?.details?.id,
    });
    if (userAcceptDone === true && userClickAccept == false) {
      setUserClickAccept(true);
      request.postAcceptUserBid(token, dataBody).then((res) => {
          setmergeItemComand(datatrip).then((res) => {
            navigation.replace('SplashScreen');
          });
        })
        .catch((err) => {
          alert("une erreur s'est produite", err);
          setUserClickAccept(false);
        });
    }
  };

  if (biddetail?.details || biddetail?.details?.length !== 0) {
    return (
      <View style={styles.container}>
        <Modal
          isVisible={userWinModal}
          onRequestClose={() => {
            setUserWinModal(false);
          }}
          onBackButtonPress={() => {
            setUserWinModal(false);
          }}>
          <View
            style={{
              backgroundColor: 'white',
              height: 380,
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <View style={{ position: 'absolute', top: -50 }}>
              <Image
                style={{ width: 100, height: 100, borderRadius: 50 }}
                source={{
                  uri:
                    'https://crazy-taxi.quizapay.com/' +
                    biddetail?.details?.user_photo,
                }}
              />
            </View>
            <View style={{ paddingTop: 52, alignItems: 'center', width: 100 }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#002',
                }}>
                {biddetail?.details?.user_first_name}{' '}
                {biddetail?.details?.user_last_name}
              </Text>
            </View>
            <View style={{}}>
              <View
                style={{
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <FontAwesome
                    name="map-marker"
                    size={22}
                    style={{ color: '#ff8612' }}
                  />
                  <View style={{ padding: 5 }}>
                    <Text style={{ opacity: 0.8 }} numberOfLines={1}>
                      {biddetail?.details?.client_position_name}
                    </Text>
                  </View>
                </View>
              </View>
              <MapView
                style={{
                  width: 310,
                  height: 150,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 30,
                }}
                provider={PROVIDER_GOOGLE}
                region={{
                  latitude: biddetail?.details?.client_latitude,
                  longitude: biddetail?.details?.client_longitude,
                  latitudeDelta: 0.03,
                  longitudeDelta: 0.03,
                }}
                customMapStyle={customMapStyle}>
                <MapViewDirections
                  lineDashPattern={[0]}
                  origin={{
                    latitude: biddetail?.details?.client_latitude,
                    longitude: biddetail?.details?.client_longitude,
                  }}
                  destination={{
                    latitude: user?.details?.latitude,
                    longitude: user?.details?.longitude,
                  }}
                  apikey={API_KEY}
                  strokeWidth={3}
                  strokeColor="#143fff"
                />
                <Marker
                  coordinate={{
                    latitude: biddetail?.details?.client_latitude,
                    longitude: biddetail?.details?.client_longitude,
                  }}
                  title={'Position actuelle du client'}
                />
                <Marker
                  coordinate={{
                    latitude: user?.details?.latitude,
                    longitude: user?.details?.longitude,
                  }}
                  title={'Votre position actuelle'}
                />
              </MapView>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 15,
                paddingVertical: 10,
              }}>
              <Text style={{ textAlign: 'center', color: '#007' }}>
                {biddetail?.details?.user_first_name}, vient de vous choisir,
                confirmez pour accepter le trafic
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
                onPress={() => {
                  setUserWinModal(false);
                }}>
                <Text style={{ color: '#002' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAcceptPost}
                style={{
                  margin: 5,
                  backgroundColor:
                    userClickAccept == true ? '#cacaca' : '#ff8612',
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
        <View style={styles.header}>
          <View style={styles.headertitle}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: '#001', fontSize: 18 }}>
                {biddetail?.details?.user_first_name}
              </Text>
            </View>
            <View style={{ justifyContent: 'center', paddingHorizontal: 2 }}>
              <View
                style={{
                  width: 9,
                  height: 9,
                  backgroundColor: '#ff8612',
                  borderRadius: 20,
                }}
              />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#001',
                  fontSize: 18,
                  width: width / 1.85,
                }}
                numberOfLines={1}>
                {biddetail?.details?.destination_place_name}
              </Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Quitter cette espace!',
                    "Es-tu sûr? De vouloir quitter l'espace?",
                    [
                      {
                        text: 'Annuler',
                        onPress: () => {
                          return null;
                        },
                      },
                      {
                        text: 'Confirmer',
                        onPress: () => handleQuit(),
                      },
                    ],
                    { cancelable: false }
                  );
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#143fff',
                  justifyContent: 'center',
                  borderRadius: 7,
                }}>
                <Text
                  style={{
                    fontWeight: '500',
                    color: '#143fff',
                    fontSize: 12,
                    padding: 5,
                  }}>
                  Quitter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <ScrollView style={{ width: width }}>
            <View style={{}}>
              <FlatList
                style={{ top: 12 }}
                data={bid}
                keyExtractor={bid.id}
                renderItem={({ item }) => {
                  return (
                    <>
                      {item.driver === pk ? (
                        <View style={{ paddingHorizontal: 5, padding: 10 }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                            }}>
                            <View
                              style={{
                                backgroundColor: '#143fff',
                                borderRadius: 10,
                                padding: 8,
                                minWidth: 50,
                                maxWidth: 200,
                                elevation: 1.5,
                              }}>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 13,
                                  fontWeight: 'bold',
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail">
                                Moi
                              </Text>
                              <Text
                                style={{
                                  paddingVertical: 3,
                                  color: '#fff',
                                  fontSize: 15,
                                }}>
                                {item.message ? item.message : item.prix}{' '}
                                {item.message ? '' : 'HTG'}
                              </Text>
                            </View>
                            <View
                              style={{
                                paddingHorizontal: 8,
                              }}>
                              <Image
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 16,
                                }}
                                source={{
                                  uri:
                                    'https://crazy-taxi.quizapay.com' +
                                    item.user_photo,
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      ) : (
                        <>
                          {item.driver === biddetail?.details?.client ? (
                            <View style={{ alignItems: 'center', padding: 10 }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View
                                  style={{
                                    paddingHorizontal: 8,
                                  }}>
                                  <Image
                                    style={{
                                      width: 35,
                                      height: 35,
                                      borderRadius: 10,
                                    }}
                                    source={{
                                      uri:
                                        'https://crazy-taxi.quizapay.com' +
                                        item.user_photo,
                                    }}
                                  />
                                </View>
                                <View
                                  style={{
                                    backgroundColor: '#ff8612',
                                    borderRadius: 10,
                                    padding: 8,
                                    maxWidth: 210,
                                    elevation: 1.5,
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontSize: 13,
                                      fontWeight: 'bold',
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    {item.user_first_name} {item.user_last_name}
                                  </Text>
                                  <Text
                                    style={{
                                      paddingVertical: 3,
                                      color: '#fff',
                                      fontSize: 15,
                                    }}>
                                    {item.message ? item.message : item.prix}{' '}
                                    {item.message ? '' : 'HTG'}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ) : (
                            <View style={{ paddingHorizontal: 5, padding: 10 }}>
                              <View style={{ flexDirection: 'row' }}>
                                <View
                                  style={{
                                    paddingHorizontal: 8,
                                  }}>
                                  <Image
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: 16,
                                    }}
                                    source={{
                                      uri:
                                        'https://crazy-taxi.quizapay.com' +
                                        item.user_photo,
                                    }}
                                  />
                                </View>
                                <View
                                  style={{
                                    backgroundColor: '#455dd1',
                                    borderRadius: 10,
                                    padding: 8,
                                    minWidth: 50,
                                    maxWidth: 200,
                                    elevation: 1.5,
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontSize: 13,
                                      fontWeight: 'bold',
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    {item.user_first_name} {item.user_last_name}
                                  </Text>
                                  <Text
                                    style={{
                                      paddingVertical: 3,
                                      color: '#fff',
                                      fontSize: 15,
                                    }}>
                                    {item.message ? item.message : item.prix}{' '}
                                    {item.message ? '' : 'HTG'}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          )}
                        </>
                      )}
                    </>
                  );
                }}
              />
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>
          {userAcceptDone == false && (
            <View style={{ alignItems: 'center' }}>
              <View style={styles.send}>
                <TextInput
                  placeholder={
                    biddetail?.details?.client === pk
                      ? 'Donner vos instructions...'
                      : 'Soumettre votre prix...'
                  }
                  keyboardType={
                    biddetail?.details?.client === pk ? 'default' : 'numeric'
                  }
                  maxLength={biddetail?.details?.client === pk ? 250 : 4}
                  onChangeText={(prix) => setPrix(prix)}
                  value={prix}
                  returnKeyType="next"
                  style={styles.sendinput}
                />
                <TouchableOpacity
                  onPress={handleSubmitPrix}
                  style={[
                    {
                      backgroundColor: prix
                        ? send == true
                          ? '#cacaca'
                          : '#ff8612'
                        : send == true
                        ? '#cacaca'
                        : '#cacaca',
                    },
                    styles.sendbutton,
                  ]}>
                  {sendLoad ? (
                    <ActivityIndicator
                      color="#ffffff"
                      size="small"
                      style={{ alignItems: 'center' }}
                    />
                  ) : (
                    <Ionicons name="send" size={19} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color="#ff8612"
          size="large"
          style={{ alignItems: 'center' }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
  },
  header: {
    justifyContent: 'center',
    height: '7.5%',
    backgroundColor: '#fff',
    borderBottomWidth: 1.5,
    borderBottomColor: '#00000033',
  },
  headertitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  body: {
    flex: 1
  },
  iconbg: {
    width: 65,
    height: 65,
    borderRadius: 7,
  },
  send: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 25,
    padding: 7,
  },
  sendinput: {
    width: '80%',
    height: 45,
    padding: 14,
    borderRadius: 45,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  sendbutton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 43,
    height: 43,
    borderRadius: 43,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default BidDriver;
