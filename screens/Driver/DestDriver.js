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
import customMapStyle from '../Rider/mapstyle.json';
import {
  getComand,
  setComand,
  setmergeItemComand,
  removeComand
} from '../../Components/Common/Auth/Sessions';
import axios from 'axios';
import Modal from 'react-native-modal';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
const { width, height } = Dimensions.get('window');

const BidDriverTrafic = ({ navigation }) => {
  const API_KEY = 'AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc';
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [temp, setTemp] = useState(0);
  const [modal, setModal] = useState(false);
  const [stop, setStop] = useState(false);
  const [biddetail, setBiddetail] = useState([]);
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
      const datatrip = {
        complete: true,
      };

        axios
          .get(
            `https://crazy-taxi.quizapay.com/api/user-driver-attemp/?pk=${pk}&id_trip=${biddetail?.id}&id_driver=${biddetail?.driver}`,
            config
          )
          .then((res) => {
            if (res.data.is_complete_comfirm == true) {
              // setmergeItemComand(datatrip).then((res) => {
              //   navigation.replace('SplashScreen');
              // });
              setModal(true)
            }
          })
          .catch((err) => {
            alert("une erreur s'est produite");
          });
    }
  }, [temp]);

  const handleQuit = () => {
    removeComand().then((suc) => {
      navigation.replace('SplashScreen');
    });
  };

  const handleNext = () => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({
      id_trip: biddetail?.details?.id,
    });
    axios
      .post(
        `https://crazy-taxi.quizapay.com/api/driver-end/?pk=${pk}`,
        body,
        config
      )
      .then((res) => {
        alert("Comfirmation requis", "Demandez au client de confirmer votre arrivée pour terminer, Merci!!")
      })
      .catch((err) => {
        alert("une erreur s'est produite", err);
      });
  }

  if (biddetail?.length !== 0 && user?.details?.length !== 0) {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={styles.map}
          region={{
            latitude: biddetail?.destination_latitude,
            longitude: biddetail?.destination_longitude,
            latitudeDelta: 0.028,
            longitudeDelta: 0.028,
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
              latitude: biddetail?.destination_latitude,
              longitude: biddetail?.destination_longitude
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
            title="Destination du client"
            coordinate={{
              latitude: biddetail?.destination_latitude,
              longitude: biddetail?.destination_longitude
            }}
          />
        </MapView>
        <View style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              top: 0
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
                  style={{width: 40, height: 40, backgroundColor: '#ff8612', alignItems: 'center', justifyContent: 'center', borderRadius: 50, elevation: 4}}>
                  <Feather name="x" size={24} color="#fff" />
                </TouchableOpacity>
          </View>
        </View>
        <View style={{
              position: 'absolute',
              justifyContent: 'center',
              bottom: 45,
              right: 25
            }}>
              <TouchableOpacity onPress={() => {
                  Alert.alert(
                    'Confirmez que vous êtes arrivé!',
                    "Es-tu sûr? Arriver au lieu fixe du client!?",
                    [
                      {
                        text: 'Annuler',
                        onPress: () => {
                          return null;
                        },
                      },
                      {
                        text: 'Confirmer',
                        onPress: () => handleNext(),
                      },
                    ],
                    { cancelable: false }
                  );
                }} 
                style={{padding: 13, flexDirection: 'row', backgroundColor: '#ff8612', alignItems: 'center', justifyContent: 'center', borderRadius: 50, elevation: 4}}>
                <Text style={{
                        color: '#fff',
                        fontSize: 16,
                        marginLeft: 10
                    }}>Terminer</Text>
                    <AntDesignIcons name="right" 
                    style={{fontSize: 18, color: '#fff', opacity: 0.3, marginLeft: 10}}/>
                    <AntDesignIcons
                    name="right"
                    style={{fontSize: 25, color: '#fff', marginLeft: -15}}
                    />
              </TouchableOpacity>
        </View>
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

export default BidDriverTrafic;
