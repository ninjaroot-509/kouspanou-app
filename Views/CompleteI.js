import React, { Component, useState, useEffect } from 'react';
import {
  Button,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Constants from 'expo-constants';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome } from 'react-native-vector-icons';
import { AntDesign } from 'react-native-vector-icons';
import { FontAwesome5 } from 'react-native-vector-icons';
import { Ionicons } from 'react-native-vector-icons';
import { setmergeItemUser, getToken } from '../Components/Common/Auth/Sessions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import request from '../Components/Common/HttpRequests';

import useUsers from '../src/state/user/hooks/useUsers';

const CompleteI = ({ navigation }) => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [photoUser, setPhotoUser] = useState('');
  const [load, setLoad] = useState(false);
  const [user, isLoading, setUsers] = useUsers();

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [user, setUsers]);

  const handleSubmit = async () => {
    const token = await getToken()
    if (first_name != '' && last_name != '' && bio != '' && photoUser != '') {
      if (load === false) {
        setLoad(true);
        const dataBody = new FormData();
        dataBody.append('first_name',first_name);
        dataBody.append('last_name',last_name);
        dataBody.append('bio',bio);
        dataBody.append('photo',
          {
            uri:photoUser,
            name: first_name + '-' + Date.now() + '.jpg',
            type:'image/jpg'
          });
        request.postUserInfoStart(token, dataBody).then((res) => {
            setmergeItemUser(res).then((i) => {
              setUsers();
              navigation.replace('SplashScreen');
              setLoad(false);
            });
          }).catch((err) => {
            alert(err);
            setLoad(false);
          });
      }
    } else {
      alert('Champs manquant!');
    }
  };

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    // console.log(result);

    if (!result.cancelled) {
      setPhotoUser(result.uri);
      // console.log(result.uri);
    }
  }

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Vous avez refusé d'autoriser cette application à accéder à votre appareil photo!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    // console.log(result);

    if (!result.cancelled) {
      setPhotoUser(result.uri);
      // console.log(result.uri);
    }
  }

  if (isLoading === true) {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
        <ActivityIndicator
          color="#ff8612"
          size="large"
          style={{ alignItems: 'center' }}
        />
      </View>
    );
  } else {
    return (
      <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
        <View style={styles.container}>
          <View style={styles.header}>
            </View>
              <View style={{justifyContent: 'center', paddingVertical: 25}}>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={showImagePicker} style={{alignItems: 'center'}}>
                    {photoUser?
                      <Image style={{
                            width: 120,
                            height: 120,
                            borderRadius: 100
                        }} 
                        source={{uri: photoUser}}/>
                        :
                        <Image style={{
                          width: 120,
                          height: 120,
                          borderRadius: 100
                      }} 
                      source={require('../assets/logo.png')}/>}
                        <View style={{position: 'absolute', justifyContent: 'center', width: 120, height: 120, backgroundColor: '#143fff65', borderRadius: 100}}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <AntDesign
                                    name="camera"
                                    size={19}
                                    style={{ color: '#ffffff' }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{alignItems: 'center', paddingVertical: 10}}>
                      <Text style={{
                        fontWeight: '500',
                        color: '#A1A3B0',
                        fontSize: 16,
                      }}>Télécharger une photo</Text>
                    </View>
                  </View>
              </View>
              <View style={{justifyContent: 'center'}}>
                  <View style={{alignItems: 'center', borderTopWidth: 0.5, borderColor: '#cacaca', paddingVertical: 10}}>
                    <View style={{padding: 8}}>
                        <View style={{padding: 4}}>
                            <Text style={{
                                fontWeight: '500',
                                color: '#143fff',
                                fontSize: 14,
                            }}>Nom</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <TextInput
                                onChangeText={(last_name) => setLastName(last_name)}
                                value={last_name}
                                placeholder={'Entrer votre nom'}
                                placeholderTextColor={'#A1A3B0'}
                                style={styles.input}
                                returnKeyType="next"
                            />
                        </View>
                    </View>
                    <View style={{padding: 8}}>
                        <View style={{padding: 4}}>
                            <Text style={{
                                fontWeight: '500',
                                color: '#143fff',
                                fontSize: 14,
                            }}>Prenom</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <TextInput
                                onChangeText={(first_name) => setFirstName(first_name)}
                                value={first_name}
                                placeholder={'Entrer votre prenom'}
                                placeholderTextColor={'#A1A3B0'}
                                style={styles.input}
                                returnKeyType="next"
                            />
                        </View>
                    </View>
                    <View style={{padding: 8}}>
                        <View style={{padding: 4}}>
                            <Text style={{
                                fontWeight: '500',
                                color: '#143fff',
                                fontSize: 14,
                            }}>Bio</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <TextInput
                                onChangeText={(bio) => setBio(bio)}
                                value={bio}
                                placeholder={'Entrer une description'}
                                placeholderTextColor={'#A1A3B0'}
                                style={styles.input}
                                multiline={true}
                                numberOfLines={4}
                                returnKeyType="next"
                            />
                        </View>
                    </View>
                    <View style={{ padding: 8, paddingTop: 30 }}>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}>
                        {load === false ? (
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                            Continuer
                          </Text>
                        ) : (
                            <ActivityIndicator
                              color="#ffffff"
                              size="small"
                              style={{ alignItems: 'center' }}
                            />
                        )}
                      </TouchableOpacity>
                    </View>
      
                  </View>
              </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
};


const styles = StyleSheet.create({
container: {
  flex: 1,
},
header: {
  justifyContent: 'center',
  paddingTop: 40,
  paddingBottom: 10,
},
headertitle: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 15,
},
input: {
  width: width / 1.2,
  height: 50,
  padding: 12,
  borderRadius: 7,
  backgroundColor: '#ffffff',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,

  elevation: 3,
},
button: {
  width: width / 1.2,
  height: 50,
  padding: 7,
  borderRadius: 8,
  backgroundColor: '#ff8612',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,

  elevation: 3,
},
});

export default CompleteI;

