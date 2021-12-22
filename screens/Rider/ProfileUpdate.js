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
  ImageBackground
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import { FontAwesome } from 'react-native-vector-icons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { AntDesign } from 'react-native-vector-icons';
import Constants from 'expo-constants';
import { FontAwesome5 } from 'react-native-vector-icons';
import { Ionicons } from 'react-native-vector-icons';
import { Entypo } from 'react-native-vector-icons';
import { Feather } from 'react-native-vector-icons';
// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import request from '../../Components/Common/HttpRequests';
import { setmergeItemUser, getToken } from '../../Components/Common/Auth/Sessions';
import * as ImagePicker from 'expo-image-picker';
import useUsers from '../../src/state/user/hooks/useUsers';
const {width, height} = Dimensions.get('window');

const ProfileUpdate = ({ navigation }) => {
  const [user, isLoading, setUsers] = useUsers();
  const [first_name, setFirstName] = useState(user?.details.first_name);
  const [last_name, setLastName] = useState(user?.details?.last_name);
  const [email, setEmail] = useState(user?.details?.email);
  const [bio, setBio] = useState(user?.details?.bio);
  const [photoUser, setPhotoUser] = useState('');
  const [load, setLoad] = useState(false);
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const dataBody = new FormData();
  dataBody.append('first_name',first_name);
  dataBody.append('last_name',last_name);
  dataBody.append('email',email);
  dataBody.append('bio',bio);

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [user, setUsers]);

  const handleSubmit = async () => {
    const token = await getToken()
    if (first_name != '' && last_name != '' && bio != '' && email != '') {
      if (reg.test(email) === true) {
        if (load === false) {
          setLoad(true);
          if (photoUser) {
            dataBody.append('photo',
              {
                uri:photoUser,
                name: first_name + '-' + Date.now() + '.jpg',
                type:'image/jpg'
              });
          }
          request.postUserInfoStart(token, dataBody).then((res) => {
              setmergeItemUser(res).then((i) => {
                setUsers();
                Alert.alert(
                  'GoTaxi!',
                  "votre profil a été modifié avec succès, Merci GoTaxi!",
                  [
                    {
                      text: 'Ok',
                      onPress: () => {
                        setUsers()
                        setWallets()
                        navigation.navigate('Profile');
                      },
                    },
                  ],
                  { cancelable: false }
                )
                setLoad(false);
              });
            }).catch((err) => {
              alert(err);
              setLoad(false);
            });
        }
      } else {
        alert("Entrez un email valide, merci!")
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
            <View style={styles.headertitle}>
              <View style={{justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => !load? navigation.goBack() : null}>
                    <Ionicons
                      name="arrow-back"
                      size={20}
                      style={{ color: '#009' }}
                    />
                  </TouchableOpacity>
              </View>
              <View style={{justifyContent: 'center'}}>
                <TouchableOpacity onPress={handleSubmit} style={{justifyContent: 'center'}}>
                  {load?
                    <ActivityIndicator
                      color="#ff8612"
                      size="small"
                      style={{ alignItems: 'center' }}
                    />
                  :
                    <Text style={{
                        fontWeight: '700',
                        color: '#ff8612',
                        fontSize: 14,
                      }}>sauvegarder</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
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
                        source={{
                          uri: 'https://crazy-taxi.quizapay.com' + user?.details?.photo
                        }}/>}
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
                                onChangeText={(text) => setLastName(text)}
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
                                onChangeText={(text) => setFirstName(text)}
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
                            }}>Email</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <TextInput
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                                placeholder={'Entrer votre addresse email'}
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
                                  onChangeText={(text) => setBio(text)}
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
    width: width / 1.1,
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
  }
});

export default ProfileUpdate; 