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
  getComand,
  removeComand,
  setmergeItemComand
} from '../../Components/Common/Auth/Sessions';
import axios from 'axios';

import useUsers from '../../src/state/user/hooks/useUsers';
import useWallets from '../../src/state/wallet/hooks/useWallets';
import useBidDetails from '../../src/state/biddetail/hooks/useBidDetails';
import Modal from 'react-native-modal';

const BidRider = ({ navigation, route }) => {
  const [user, isLoading, setUsers] = useUsers();
  const [wallet, isLoadingW, setWallets] = useWallets();
  const [biddetail, isLoadingB, setBidDetails] = useBidDetails();
  const [stop, setStop] = useState(false);
  const [temp, setTemp] = useState(0);
  const pk = user?.details?.id;
  const [prix, setPrix] = useState('');
  const [send, setSend] = useState(false);
  const [bid, setBid] = useState([]);
  const [userWinModal, setUserWinModal] = useState(false);
  const [userAcceptDone, setUserAcceptDone] = useState(false);

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

    if (userAcceptDone == true) {
      const config = { headers: { 'Content-Type': 'application/json' } };
      axios
        .get(
          `https://crazy-taxi.quizapay.com/api/driver-attemp/?pk=${pk}&id_trip=${biddetail?.details?.id}`,
          config
        )
        .then((res) => {
          if (res.is_win == true) {
            setUserWinModal(true);
          }
        })
        .catch((err) => {
          alert("une erreur s'est produite");
        });
    }
  }, [temp]);

  const handleSubmitPrix = () => {
    if (biddetail?.details && prix && send == false && userAcceptDone == false) {
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
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({
      id_trip: biddetail?.details?.id,
    });
    axios
      .post(
        `https://crazy-taxi.quizapay.com/api/driver-quits/?pk=${pk}`,
        body,
        config
      )
      .then((res) => {
        removeComand().then((suc) => {
          navigation.replace('SplashScreen');
        });
      });
  };

  const handleAcceptPost = () => {
    let datatrip = {
      is_active: true,
      driver: pk,
      driver_longitude: user?.details?.longitude,
      driver_latitude: user?.details?.latitude,
    };
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({
      id_trip: biddetail?.details?.id,
    });
    if (userAcceptDone === false) {
      axios
        .post(
          `https://crazy-taxi.quizapay.com/api/driver-accept/?pk=${pk}`,
          body,
          config
        )
        .then((res) => {
          setUserAcceptDone(true);
          setmergeItemComand(datatrip).then((res) => {
            navigation.replace('SplashScreen');
          });
        })
        .catch((err) => {
          alert("une erreur s'est produite");
        });
    }
  };

  if (biddetail?.details || biddetail?.details?.length !== 0) {
    return (
      <View style={styles.container}>
        <Modal
          isVisible={userWinModal}
          onRequestClose={() => setUserWinModal(false)}
          onBackButtonPress={() => setUserWinModal(false)}>
          <View
            style={{
              backgroundColor: 'white',
              height: 200,
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>
                Comfirmation
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
                onPress={() => setUserWinModal(false)}>
                <Text style={{ color: '#000' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAcceptPost}
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
            <TouchableOpacity
              style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FontAwesome
                name="pencil-square-o"
                size={20}
                style={{ color: '#143fff' }}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: '#001', fontSize: 19 }}>
                {biddetail?.details?.user_first_name}
              </Text>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#ff8612',
                    borderRadius: 20,
                    marginHorizontal: 8,
                  }}
                />
              </View>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#001',
                  fontSize: 19,
                  width: 150,
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
                  fontSize: 13,
                  padding: 8,
                }}>
                Quitter
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.body}>
          <ScrollView style={{ width: '100%' }}>
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
                                backgroundColor: '#ff8612',
                                borderBottomLeftRadius: 12,
                                borderBottomRightRadius: 12,
                                borderTopLeftRadius: 12,
                                padding: 15,
                                maxWidth: 190,
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
                                  padding: 5,
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
                                  borderRadius: 22,
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
                        <View style={{ paddingHorizontal: 5, padding: 20 }}>
                          <View style={{ flexDirection: 'row' }}>
                            <View
                              style={{
                                paddingHorizontal: 8,
                              }}>
                              <Image
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 22,
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
                                backgroundColor: '#143fff',
                                borderBottomLeftRadius: 12,
                                borderBottomRightRadius: 12,
                                borderTopRightRadius: 12,
                                padding: 15,
                                maxWidth: 190,
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
                                  padding: 5,
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
                  );
                }}
              />
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>
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
                <Ionicons name="send" size={19} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
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
    paddingTop: Constants.statusBarHeight,
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderBottomWidth: 1.8,
    borderBottomColor: '#00000033',
  },
  headertitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 12,
    top: 0,
    bottom: 0,
  },
  body: {
    width: '100%',
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
    bottom: 40,
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
