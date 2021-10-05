import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import mapstyle from './mapstyle.json';
import Feather from 'react-native-vector-icons/Feather';
import MapViewDirections from 'react-native-maps-directions';
import Svg, { Polygon } from 'react-native-svg';
import request from '../../Components/Common/HttpRequests';
import useUsers from '../../src/state/user/hooks/useUsers';
import useWallets from '../../src/state/wallet/hooks/useWallets';
import customMapStyle from './mapstyle.json';
import {
  getComand,
  setComand
} from '../../Components/Common/Auth/Sessions';
import axios from 'axios';
import Modal from 'react-native-modal';

Geocoder.init('AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc');
const { width, height } = Dimensions.get('window');

const App = () => {
  const API_KEY = 'AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc';
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [temp, setTemp] = useState(0);
  const [modal, setModal] = useState(false);
  const [arrive, setArrive] = useState(false);
  const [arriveEnd, setArriveEnd] = useState(false);
  const [biddetail, setBiddetail] = useState([]);
  const [client, setClient] = useState([]);
  const [user, isLoading, setUsers] = useUsers();

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [setUsers, user]);

  useEffect(() => {
    if (biddetail.length === 0) {
        getComand.then((res)=> {
            setBiddetail(res)
        })
    }
  });

  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 7000);
  }, []);

  useEffect(() => {
    if (biddetail.length !== 0) {
        const config = { headers: { 'Content-Type': 'application/json' } };
        if (arrive == true) {
            axios
              .get(
                `https://crazy-taxi.quizapay.com/api/user-driver-attemp/?pk=${pk}&id_trip=${biddetail?.details?.id}&id_driver=${userChoose?.driver}`,
                config
              )
              .then((res) => {
                let datatrip = {
                  arrival: true,
                };
                if (res.data.is_arrivale_comfirm == true) {
                  setmergeItemComand(datatrip).then((res) => {
                    navigation.replace('SplashScreen');
                  });
                }
              })
              .catch((err) => {
                alert("une erreur s'est produite");
              });
        }

        if (arriveEnd == true) {
            axios
              .get(
                `https://crazy-taxi.quizapay.com/api/user-driver-attemp/?pk=${pk}&id_trip=${biddetail?.details?.id}&id_driver=${userChoose?.driver}`,
                config
              )
              .then((res) => {
                let datatrip = {
                    complete: true,
                };
                if (res.data.is_complete_comfirm == true) {
                  setmergeItemComand(datatrip).then((res) => {
                    navigation.replace('SplashScreen');
                  });
                }
              })
              .catch((err) => {
                alert("une erreur s'est produite");
              });
        }
    }

  }, [temp]);

  const [latLng, setLatLng] = useState({
    latitudeDelta: LONGITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
    latitude: biddetail?.arrival == true? biddetail?.destination_latitude : client?.latitude,
    longitude: biddetail?.arrival == true? biddetail?.destination_longitude : client?.longitude,
  });

  const handleArriv = () => {
      if (biddetail?.arrival == true) {
        setArriveEnd(true)
      } else {
          setArrive(true)
      }
  }

  return (
    <View style={{ flex: 1 }}>
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
              {biddetail?.arrival == true? 'Deja arriver!?' : 'Vous avez trouver le passager !?'}
            </Text>
          </View>
          <View style={{ padding: 17, alignItems: 'center', width: 300 }}>
            <Text style={{ textAlign: 'justify' }}>
              Hello user, Confirmez que vous êtes {biddetail?.arrival == true? 'deja arriver' : 'avec le passager'}
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
      <MapView style={styles.map} region={latLng} provider={PROVIDER_GOOGLE}>
        <MapViewDirections
          origin={{
            latitude: user?.details?.latitude,
            longitude: user?.details?.longitude
          }}
          destination={latLng}
          apikey={API_KEY}
          strokeWidth={3}
          strokeColor="#143fff"
          optimizeWaypoints={true}
        />
        <MapView.Marker title="votre position actuelle" coordinate={{
            latitude: user?.details?.latitude,
            longitude: user?.details?.longitude
          }} />
        <MapView.Marker title="position actuelle du client" coordinate={latLng} />
      </MapView>

      <View
        style={{
          position: 'absolute',
          flex: 1,
          bottom: 50,
          right: 45,
        }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setModal(true)}
              style={{
                width: 55,
                height: 55,
                backgroundColor: '#ff8612',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                elevation: 4,
              }}>
              <Ionicons
                name="arrow-forward"
                size={24}
                style={styles.iconBlack}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  iconBlack: {
    color: '#fff',
  },
  map: {
    width: width,
    height: height,
  },
});

export default App;
