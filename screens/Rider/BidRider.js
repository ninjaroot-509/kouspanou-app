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
  getToken,
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
import BoxLeft from './Message/BoxLeft'
import BoxRight from './Message/BoxRight'
import DriverInfo from './Modal/DriverInfo'

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
  const [sendLoad, setSendLoad] = useState(false);
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
    if (!wallet?.details || wallet?.details?.length === 0) {
      setWallets();
    }
  }, [setWallets, wallet]);

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
      handleGetBid()
    }

    if (biddetail?.details?.choose === true) {
      getTripInfo()
    }
  }, [temp]);

  const handleGetBid = async () => {
    const token = await getToken()
    request.getBidPrix(token, biddetail?.details?.id).then((res) => {
      setBid(res);
      setSendLoad(false);
    });
  }


  const getTripInfo = async () => {
      const token = await getToken()
      request.getTripInfo(token, biddetail?.details?.id, biddetail?.details?.driver).then((res) => {
        const datatrip = {
          arrival: false,
          complete: false,
          client: pk,
          is_active: false,
        };
        if (res.is_comfirm == true) {
          setmergeItemComand(datatrip).then((res) => {
            navigation.replace('SplashScreen');
          });
        }
      })
    .catch((err) => {
      alert("une erreur s'est produite..!");
    });
  }

  const handleSubmitPrix = async () => {
    const token = await getToken()
    setSendLoad(true);
    if (
      biddetail?.details &&
      prix &&
      send == false &&
      biddetail?.details?.choose == false
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
          }).catch((err) => {
            alert("une erreur s'est produite");
            setPrix('');
            setSend(false);
          });
      } else {
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
    request.postQuitUserBid(token, dataBody).then((res) => {
      removeComand().then((suc) => {
        navigation.replace('SplashScreen');
      });
    });
  };

  const handleChoosePost = async () => {
    const token = await getToken()
    const datatrip = {
      choose: true,
      driver: userChoose?.driver,
      driver_latitude: userChoose?.driver_latitude,
      driver_longitude: userChoose?.driver_longitude,
      client_latitude: user?.details?.latitude,
      client_longitude: user?.details?.longitude,
    };
    const dataBody = JSON.stringify({
      id_trip: biddetail?.details?.id,
      id_driver: userChoose?.driver,
    });
    if (
      biddetail?.details?.choose === false &&
      wallet?.details?.montant >= userChoose?.prix
    ) {
      request.postChooseUserBid(token, dataBody).then((res) => {
          setmergeItemComand(datatrip).then((res) => {
            navigation.replace('BidRider');
          });
          setUserChooseModal(false);
        });
    } else {
      alert('votre solde est insuffisant, merci!!');
    }
  };

  const handleChoose = (item) => {
    if (userChoose?.length !== 0) {
      setUserChoose(item);
      setUserChooseModal(true);
    }
  };

  if (biddetail?.details || biddetail?.details?.length !== 0) {
    return (
      <View style={styles.container}>
        <DriverInfo handleChoosePost={handleChoosePost} setUserChoose={setUserChoose} userChooseModal={userChooseModal} setUserChooseModal={setUserChooseModal} setViewMore={setViewMore} userChoose={userChoose} handleView={handleView} viewMore={viewMore} user={user} />
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
              {bid.length === 0 && (
                <View style={{ alignItems: 'center', padding: 15 }}>
                  <View
                    style={{
                      width: width / 1.8,
                      height: 30,
                      backgroundColor: '#cccccc',
                      borderRadius: 7,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: '700',
                      }}>
                      Pas encore de message!.
                    </Text>
                  </View>
                </View>
              )}
              {biddetail?.details?.choose === true && (
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 15 }}>
                  <View
                    style={{
                      width: width / 1.3,
                      height: 30,
                      backgroundColor: '#ff8612',
                      borderRadius: 7,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: '700',
                      }}>
                      Veuillez attendre l'acceptation du chauffeur!.
                    </Text>
                  </View>
                </View>
              )}
              <FlatList
                style={{ top: 12 }}
                data={bid}
                keyExtractor={bid.id}
                renderItem={({ item }) => {
                  return (
                    <>
                      {item.driver === pk ? (
                        <BoxRight item={item} />
                      ) : (
                        <BoxLeft item={item} biddetail={biddetail} pk={pk} handleChoose={handleChoose} />
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
                      ? 'Envoyer vos instructions...'
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
    height: '7.4%',
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

export default BidRider;
