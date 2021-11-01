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
  const [arrive, setArrive] = useState(false);
  const [arriveEnd, setArriveEnd] = useState(false);
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
    }, 30000);
  }, []);

  useEffect(() => {
    if (biddetail?.length !== 0) {
      const config = { headers: { 'Content-Type': 'application/json' } };

        axios
          .get(
            `https://crazy-taxi.quizapay.com/api/get-driver/?pk=${pk}&id_driver=${biddetail?.driver}`,
            config
          )
          .then((res) => {
            if (res) {
              setDriver(res.data);
              setUsers()
            }
          })
          .catch((err) => {
            alert("une erreur s'est produite");
          });

      if (biddetail?.arrival == false) {
        axios
          .get(
            `https://crazy-taxi.quizapay.com/api/user-driver-attemp/?pk=${pk}&id_trip=${biddetail?.id}&id_driver=${biddetail?.driver}`,
            config
          )
          .then((res) => {
            if (res.data.is_arrivale == true) {
              setModal(true);
            }
          })
          .catch((err) => {
            alert("une erreur s'est produite");
          });
      }

    }
  }, [temp]);

  const handleArriv = () => {
    const datatrip = {
      arrival: true,
    };
    setmergeItemComand(datatrip).then((res) => {
      navigation.replace('SplashScreen');
    });
  };

  const handleQuit = () => {
    removeComand().then((suc) => {
      navigation.replace('SplashScreen');
    });
  };

  if (biddetail?.length !== 0 && driver?.length !== 0) {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={styles.map}
          region={{
            latitude:
              biddetail?.arrival == true
                ? biddetail?.destination_latitude
                : driver?.latitude,
            longitude:
              biddetail?.arrival == true
                ? biddetail?.destination_longitude
                : driver?.longitude,
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
              latitude:
                biddetail?.arrival == true
                  ? biddetail?.destination_latitude
                  : driver?.latitude,
              longitude:
                biddetail?.arrival == true
                  ? biddetail?.destination_longitude
                  : driver?.longitude,
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
              latitude:
                biddetail?.arrival == true
                  ? biddetail?.destination_latitude
                  : driver?.latitude,
              longitude:
                biddetail?.arrival == true
                  ? biddetail?.destination_longitude
                  : driver?.longitude,
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
              borderRadius: 10,
            }}>
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>
                {biddetail?.arrival == true
                  ? 'Deja arriver!?'
                  : 'Vous avez trouver le Chauffeur !?'}
              </Text>
            </View>
            <View style={{ padding: 17, alignItems: 'center', width: 300 }}>
              <Text style={{ textAlign: 'justify' }}>
                Hello user, Confirmez que vous êtes{' '}
                {biddetail?.arrival == true
                  ? 'deja arriver'
                  : 'avec le Chauffeur'}
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
                onPress={handleArriv}
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
