import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput
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
  const [modalTwo, setModalTwo] = useState(false);
  const [stop, setStop] = useState(false);
  const [comfirmLoad, setComfirmLoad] = useState(false);
  const [err, setErr] = useState(false);
  const [code, setCode] = useState("GT-");
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
    }, 15000);
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
    axios
      .post(
        `https://crazy-taxi.quizapay.com/api/driverEnd/?pk=${pk}&id_trip=${biddetail?.id}&id_client=${biddetail?.client}`,
        config
      )
      .then((res) => {
        setModal(true)
      }).catch((err) => {
        alert("une erreur s'est produite", err);
      });
  }

  const handleNextEnd = () => {
    setComfirmLoad(true)
    setErr(false)
    const config = { headers: { 'Content-Type': 'application/json' } };
    const code_full = 'GT-' + code
    const body = JSON.stringify({
      code: code,
    });
    if (comfirmLoad == false) {
      axios
        .post(
          `https://crazy-taxi.quizapay.com/api/driver-end-finale/?pk=${pk}&id_trip=${biddetail?.id}&id_client=${biddetail?.client}`,
          body,
          config
        )
        .then((res) => {
          // alert("Comfirmation requis", "Demandez au client de confirmer votre arrivée pour terminer, Merci!!")
          Alert.alert(
            'GoTaxi!',
            "Merci, d'avoir utiliser le service GoTaxi et a bientot",
            [
              {
                text: 'Ok',
                onPress: () => handleFinale(),
              },
            ],
            { cancelable: false }
          );
        })
        .catch((err) => {
          alert("Veuillez vous assurer qu'il s'agit bien du code de vérification", err);
          setErr(true)
          setComfirmLoad(false)
        });
    }
  }

  const handleFinale = () => {
    removeComand().then((suc) => {
      navigation.replace('SplashScreen');
    });
  };



  if (biddetail?.length !== 0 && user?.details?.length !== 0) {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          isVisible={modal}
          onRequestClose={() => setModal(false)}
          onBackButtonPress={() => setModal(false)}>
          <View
            style={{
              backgroundColor: 'white',
              height: 250,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <View style={{  }}>
              <Text style={{ color: '#000', fontWeight: 'bold', color: '#ff9612', fontSize: 19 }}>
                Verification code
              </Text>
            </View>
            <View style={{ padding: 17, alignItems: 'center', width: 300 }}>
              <Text style={{ textAlign: 'center', color: '#007' }}>
                Hello user, Demandez au client le code de confirmation pour finaliser le traffic, Merci!!
              </Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 12}}>
              <TextInput
                onChangeText={(code) => setCode(code)}
                value={code}
                placeholder={'GT-xxxxxx'}
                placeholderTextColor={'#cacaca'}
                style={{borderWidth: 1, borderRadius: 12, borderColor: err === true? 'red' : '#009', width: 200, height: 45, padding: 7}}
                returnKeyType="next"
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <TouchableOpacity
                onPress={handleNextEnd}
                style={{
                  margin: 5,
                  backgroundColor: comfirmLoad === true? '#cacaca' : '#ff8612',
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
