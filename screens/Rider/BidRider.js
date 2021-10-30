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
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import { FontAwesome } from 'react-native-vector-icons';
import { Feather } from 'react-native-vector-icons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { AntDesign } from 'react-native-vector-icons';
import Constants from 'expo-constants';
import { FontAwesome5 } from 'react-native-vector-icons';
import { Ionicons } from 'react-native-vector-icons';
import { Entypo } from 'react-native-vector-icons';
// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import moment from 'moment';
import request from '../../Components/Common/HttpRequests';
import {
  getUser,
  getComand,
  removeComand,
  setmergeItemComand,
} from '../../Components/Common/Auth/Sessions';
import axios from 'axios';

import useUsers from '../../src/state/user/hooks/useUsers';
import useBidDetails from '../../src/state/biddetail/hooks/useBidDetails';
import useWallets from '../../src/state/wallet/hooks/useWallets';
import Modal from 'react-native-modal';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import customMapStyle from './mapstyle.json';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const BidRider = ({ navigation }) => {
  const [user, isLoading, setUsers] = useUsers();
  const [wallet, isLoadingW, setWallets] = useWallets();
  const [biddetail, isLoadingB, setBidDetails] = useBidDetails();
  const [stop, setStop] = useState(false);
  const [temp, setTemp] = useState(0);
  const pk = user?.details?.id;
  const [prix, setPrix] = useState('');
  const [send, setSend] = useState(false);
  const [bid, setBid] = useState([]);
  const [userChoose, setUserChoose] = useState();
  const [userChooseModal, setUserChooseModal] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const API_KEY = 'AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc';
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const handleView = () => {
    setViewMore(!viewMore);
  };

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
    }, 7000);
  }, []);

  useEffect(() => {
    if (biddetail?.details || biddetail?.details?.length !== 0) {
      request.getBidPrix(pk, biddetail?.details?.id).then((res) => {
        setBid(res);
      });
    }

    if (biddetail?.details?.choose === true) {
      const config = { headers: { 'Content-Type': 'application/json' } };
      axios
        .get(
          `https://crazy-taxi.quizapay.com/api/user-driver-attemp/?pk=${pk}&id_trip=${biddetail?.details?.id}&id_driver=${biddetail?.details?.driver}`,
          config
        )
        .then((res) => {
          const datatrip = {
            arrival: false,
            complete: false,
            client: pk,
            is_active: false,
          };
          if (res.data.is_comfirm == true) {
            setmergeItemComand(datatrip).then((res) => {
              navigation.replace('SplashScreen');
            });
          }
        })
        .catch((err) => {
          alert("une erreur s'est produite ..!");
        });
    }
  }, [temp]);

  const handleSubmitPrix = () => {
    if (
      biddetail?.details &&
      prix &&
      send == false &&
      biddetail?.details?.choose == false
    ) {
      setSend(true);
      if (biddetail?.details?.client === pk) {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify({
          id_trip: biddetail?.details?.id,
          prix: prix,
        });
        axios
          .post(
            `https://crazy-taxi.quizapay.com/api/user-instructions/?pk=${pk}`,
            body,
            config
          )
          .then((res) => {
            setPrix('');
            setSend(false);
          })
          .catch((err) => {
            alert("une erreur s'est produite");
            setPrix('');
            setSend(false);
          });
      } else {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify({
          id_trip: biddetail?.details?.id,
          prix: prix,
        });
        axios
          .post(
            `https://crazy-taxi.quizapay.com/api/driver-prix/?pk=${pk}`,
            body,
            config
          )
          .then((res) => {
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

  const handleQuit = () => {
    removeComand().then((suc) => {
      navigation.replace('SplashScreen');
    });
  };

  const handleChoosePost = () => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const datatrip = {
      choose: true,
      driver: userChoose?.driver,
    };
    const body = JSON.stringify({
      id_trip: biddetail?.details?.id,
      id_driver: userChoose?.driver,
    });
    if (biddetail?.details?.choose === false) {
      axios
        .post(
          `https://crazy-taxi.quizapay.com/api/driver-choose/?pk=${pk}`,
          body,
          config
        )
        .then((res) => {
          setmergeItemComand(datatrip).then((res) => {
            navigation.replace('SplashScreen');
          });
          setUserChooseModal(false);
        });
    }
  };

  const handleChoose = (item) => {
    console.log(item)
    if (userChoose?.length !== 0) {
      setUserChoose(item);
      setUserChooseModal(true);
    }
  };

  if (biddetail?.details || biddetail?.details?.length !== 0) {
    return (
      <View style={styles.container}>
        <Modal
          isVisible={userChooseModal}
          onRequestClose={() => {
            setUserChooseModal(false);
            setViewMore(false);
          }}
          onBackButtonPress={() => {
            setUserChooseModal(false);
            setViewMore(false);
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
                    'https://crazy-taxi.quizapay.com/' + userChoose?.user_photo,
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
                {userChoose?.user_first_name} {userChoose?.user_last_name}
              </Text>
              <TouchableOpacity onPress={handleView}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#ff8612',
                    textDecorationColor: 'underline',
                  }}>
                  {viewMore === true ? 'Voir moins' : 'Voir plus'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{}}>
              {viewMore === true ? (
                <View style={{ height: 205 }}>
                  <FlatList
                    style={{ bottom: 0, top: 20 }}
                    horizontal={true}
                    data={[
                      {
                        id: 1,
                        image:
                          'https://crazy-taxi.quizapay.com/' +
                          userChoose?.user_photo,
                      },
                      {
                        id: 2,
                        image:
                          'https://crazy-taxi.quizapay.com/' +
                          userChoose?.user_photo,
                      },
                    ]}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => {
                      return (
                        <View style={{ paddingHorizontal: 6 }}>
                          <View style={{}}>
                            <Image
                              style={{
                                width: 190,
                                height: 180,
                                borderRadius: 5,
                              }}
                              source={{
                                uri: item.image,
                              }}
                            />
                          </View>
                        </View>
                      );
                    }}
                  />
                </View>
              ) : (
                <>
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
                          {userChoose?.driver_place_name}
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
                      latitude: userChoose?.driver_latitude,
                      longitude: userChoose?.driver_longitude,
                      latitudeDelta: 0.03,
                      longitudeDelta: 0.03,
                    }}
                    customMapStyle={customMapStyle}>
                    <MapViewDirections
                    lineDashPattern={[0]}
                      origin={{
                        latitude: userChoose?.driver_latitude,
                        longitude: userChoose?.driver_longitude,
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
                        latitude: userChoose?.driver_latitude,
                        longitude: userChoose?.driver_longitude,
                      }}
                      title={'Position actuelle du chauffeur'}
                    />
                    <Marker
                      coordinate={{
                        latitude: user?.details?.latitude,
                        longitude: user?.details?.longitude,
                      }}
                      title={'Votre position actuelle'}
                    />
                  </MapView>
                </>
              )}
            </View>
            <View
              style={{
                paddingTop: 15,
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
                  setViewMore(false);
                  setUserChooseModal(false);
                  setUserChoose()
                }}>
                <Text style={{ color: '#002' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleChoosePost}
                style={{
                  margin: 5,
                  backgroundColor: '#ff8612',
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
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: '#001', fontSize: 18 }}>
                {biddetail?.details?.user_first_name}
              </Text>
            </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View
                  style={{
                    width: 9,
                    height: 9,
                    backgroundColor: '#ff8612',
                    borderRadius: 20,
                  }}
                />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#001',
                    fontSize: 18,
                    width: width / 1.9,
                  }}
                  numberOfLines={1}>
                  {biddetail?.details?.destination_place_name}
                </Text>
              </View>
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
                            <View>
                              <View
                                style={{
                                  backgroundColor: '#ff8612',
                                  borderRadius: 10,
                                  padding: 8,
                                  maxWidth: 210,
                                  elevation: 1.5
                                }}>
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 13,
                                    fontWeight: 'bold',
                                    textAlign: 'left'
                                  }}
                                  numberOfLines={1}
                                  ellipsizeMode="tail">
                                  Moi
                                </Text>
                                <Text
                                  style={{
                                    padding: 2,
                                    color: '#fff',
                                    fontSize: 15,
                                    textAlign: 'left'
                                  }}>
                                  {item.message ? item.message : item.prix}{' '}
                                  {item.message ? '' : 'HTG'}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  padding: 5,
                                  color: '#143fff',
                                  fontSize: 12,
                                }}>
                                {moment(item.updated_on).fromNow()}
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
                                    'https://crazy-taxi.quizapay.com/' +
                                    item.user_photo,
                                }}
                              />
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
                                    'https://crazy-taxi.quizapay.com/' +
                                    item.user_photo,
                                }}
                              />
                            </View>
                            <View>

                            <View
                              style={{
                                backgroundColor: '#143fff',
                                borderRadius: 10,
                                padding: 8,
                                maxWidth: 210,
                                elevation: 1.5
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
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
                                {biddetail?.details?.client === pk && biddetail?.details?.choose == false && (
                                    <TouchableOpacity
                                      onPress={() => handleChoose(item)}
                                      style={{
                                        width: 20,
                                        height: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#ff9612',
                                        borderRadius: 18,
                                        marginHorizontal: 10,
                                      }}>
                                      <Feather name="user-check" color="#fff" />
                                    </TouchableOpacity>
                                  )}
                              </View>
                              <Text
                                style={{
                                  padding: 2,
                                  color: '#fff',
                                  fontSize: 15,
                                }}>
                                {item.message ? item.message : item.prix}{' '}
                                {item.message ? '' : 'HTG'}
                              </Text>
                            </View>
                            <Text
                                style={{
                                  padding: 5,
                                  color: '#143fff',
                                  fontSize: 12,
                                }}>
                                {moment(item.updated_on).fromNow()}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </>
                  );
                }}
              />
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>
          {biddetail?.details?.choose === false && (
            <View style={{ alignItems: 'center' }}>
              <View style={styles.send}>
                <TextInput
                  placeholder={
                    biddetail?.details?.client === pk
                      ? 'Donner vos instructions...'
                      : 'Soumettre votre prix en gourdes..'
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
                  <Ionicons name="send" size={19} color="#fff" />
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
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    justifyContent: 'center',
    width: width,
    backgroundColor: '#fff',
    borderBottomWidth: 1.8,
    borderBottomColor: '#00000033',
  },
  headertitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 12,
  },
  body: {
    width: width,
    height: '92%',
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

export default BidRider;
