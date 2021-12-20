import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapViewDirections from 'react-native-maps-directions';
import Svg, { Polygon } from 'react-native-svg';
import request from '../../Components/Common/HttpRequests';
import useUsers from '../../src/state/user/hooks/useUsers';
import useWallets from '../../src/state/wallet/hooks/useWallets';
import customMapStyle from './mapstyle.json';
import {
  getToken,
  getComand,
  setComand,
  setmergeItemComand,
  removeComand
} from '../../Components/Common/Auth/Sessions';
import axios from 'axios';
import Modal from 'react-native-modal';
const { width, height } = Dimensions.get('window');
import AntDesignIcons from 'react-native-vector-icons/AntDesign';

const BidRiderTrafic = ({ navigation }) => {
  const API_KEY = 'AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc';
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [temp, setTemp] = useState(0);
  const [modal, setModal] = useState(false);
  const [stop, setStop] = useState(false);
  const [biddetail, setBiddetail] = useState([]);
  const [driver, setDriver] = useState([]);
  const [user, isLoading, setUsers] = useUsers();
  const pk = user?.details?.id;

  useEffect(() => {
    if (!user?.details || user?.details?.length === 0) {
      setUsers();
    }
  }, [setUsers, user]);

  useEffect(() => {
    if (biddetail?.length === 0) {
      getComand().then((res) => {
        setBiddetail(res);
      });
    }
  });

  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 15000);
  }, []);

  useEffect(() => {
    if (biddetail?.length !== 0) {
      if (stop === false) {
        getDriverInfo()
      }

      if (biddetail?.arrival == false) {
        getTripInfo()
      }

    }
  }, [temp]);

  const getTripInfo = async () => {
    const token = await getToken()
    request.getTripInfo(token, biddetail?.id, biddetail?.driver).then((res) => {
      if (res.is_arrivale == true) {
        setModal(true);
      }
    })
    .catch((err) => {
      alert("une erreur s'est produite..!");
    });
  }

  const getDriverInfo = async () => {
      const token = await getToken()
      request.getDriverInfo(token, biddetail?.driver).then((res) => {
        setDriver(res);
        setUsers()
        setStop(true)
      })
    .catch((err) => {
      alert("une erreur s'est produite..!");
    });
  }

  const handleViewDriver = async () => {
    const token = await getToken()
    const datatrip = {
      arrival: true,
    };
    const dataBody = JSON.stringify({
      id_trip: biddetail?.id,
      id_driver: biddetail?.driver,
    });
    request.postViewDriverBid(token, dataBody).then((res) => {
        setmergeItemComand(datatrip).then((res) => {
          navigation.replace('SplashScreen');
        });
      })
      .catch((err) => {
        alert("une erreur s'est produite", err);
      });
  };

  const handleQuit = () => {
    removeComand().then((suc) => {
      navigation.replace('SplashScreen');
    });
  };

  if (biddetail?.length !== 0 && driver?.length !== 0 && user?.details?.length !== 0) {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={styles.map}
          region={{
            latitude: driver?.latitude,
            longitude: driver?.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
          provider={PROVIDER_GOOGLE}
          customMapStyle={customMapStyle}>
          <MapViewDirections
            lineDashPattern={[0]}
            origin={{
              latitude: user?.details?.latitude,
              longitude: user?.details?.longitude,
            }}
            destination={{
              latitude: biddetail?.driver_latitude,
              longitude: biddetail?.driver_longitude,
            }}
            apikey={API_KEY}
            strokeWidth={3}
            strokeColor="#143fff"
          />
          <Marker
            title="votre position actuelle"
            coordinate={{
              latitude: user?.details?.latitude,
              longitude: user?.details?.longitude,
            }}
          />

          <Marker
            title="position actuelle du chauffeur"
            coordinate={{
              latitude: driver?.latitude,
              longitude: driver?.longitude,
            }}
          />

          <Marker
            title="position du chauffeur 1"
            coordinate={{
              latitude: biddetail?.driver_latitude,
              longitude: biddetail?.driver_longitude,
            }}
          />          
        </MapView>
        <View style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
          <View
            style={{
              paddingVertical: 50,
              paddingHorizontal: 30,
            }}>
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                      'Quitter le trafic!',
                      "Es-tu sûr? De vouloir quitter le trafic maintenant?",
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
                  style={{width: 35, height: 35, backgroundColor: '#ff8612', alignItems: 'center', justifyContent: 'center', borderRadius: 50, elevation: 4}}>
                  <Feather name="x" size={24} color="#fff" />
                </TouchableOpacity>
          </View>
        </View>
        <Modal
          isVisible={modal}
          onRequestClose={() => setModal(false)}
          onBackButtonPress={() => setModal(false)}>
          <View
            style={{
              backgroundColor: 'white',
              height: 200,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <View style={{  }}>
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}>
              Avez-vous vu le chauffeur !?
              </Text>
            </View>
            <View style={{ padding: 15, alignItems: 'center', width: 300 }}>
              <Text style={{ textAlign: 'center' }}>
                Hello {user?.details?.first_name}, Confirmez que vous êtes en compagnie du chauffeur!
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <TouchableOpacity
                onPress={handleViewDriver}
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
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1
  },
});

export default BidRiderTrafic;
