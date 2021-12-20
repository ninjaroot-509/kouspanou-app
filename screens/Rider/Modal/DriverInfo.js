import React from 'react';
import { View, TouchableOpacity, Text, Image, FlatList, Dimensions } from "react-native";
import moment from 'moment';
import Modal from 'react-native-modal';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import customMapStyle from '../mapstyle.json';
import MapViewDirections from 'react-native-maps-directions';
import { FontAwesome } from 'react-native-vector-icons';
import { Feather } from 'react-native-vector-icons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { AntDesign } from 'react-native-vector-icons';
import Constants from 'expo-constants';
import { FontAwesome5 } from 'react-native-vector-icons';
const { width, height } = Dimensions.get('window');

const DriverInfo = ({userChooseModal, setUserChoose, setUserChooseModal, setViewMore, userChoose, handleView, viewMore, user, handleChoosePost}) => {
    const API_KEY = 'AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc';
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  return (
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
        <View style={{ position: 'absolute', top: -55 }}>
        <View style={{width: 100.5, height: 100.5, elevation: 2, borderRadius: 50, backgroundColor: '#ffffff'}}>
            <Image
            style={{ width: 100, height: 100, borderRadius: 50 }}
            source={{
                uri:
                'https://crazy-taxi.quizapay.com/' + userChoose?.user_photo,
            }}
            />
        </View>
        </View>
        <View style={{ paddingTop: 52, alignItems: 'center', width: 100 }}>
            <Text
            style={{
                textAlign: 'center',
                fontWeight: '700',
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
                setUserChoose();
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
  );
}

export default DriverInfo;
