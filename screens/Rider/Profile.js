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
  ImageBackground,
  Alert
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
const {width, height} = Dimensions.get('window');
import useUsers from '../../src/state/user/hooks/useUsers';
import useWallets from '../../src/state/wallet/hooks/useWallets';
import { removeUserSession } from '../../Components/Common/Auth/Sessions';

const ProfileScreen = ({ navigation }) => {
  const [user, isLoadingUser, setUsers] = useUsers();
  const [wallet, isLoadingW, setWallets] = useWallets();

  useEffect(() => {
    if (!wallet.details || wallet.details.length === 0) {
      setWallets();
    }
  }, [setWallets, wallet]);

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [user, setUsers]);

  return (
    <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <View style={{height: 20}}/>
          <View style={{justifyContent: 'center', paddingVertical: 25}}>
              <View style={{alignItems: 'center'}}>
                <View style={{alignItems: 'center'}}>
                  <Image style={{
                        width: 120,
                        height: 120,
                        borderRadius: 50
                    }} 
                    source={{
                      uri: 'https://crazy-taxi.quizapay.com' + user?.details?.photo
                    }}/>
                </View>
                <View style={{alignItems: 'center', paddingVertical: 5}}>
                  <Text style={{
                    fontWeight: '700',
                    color: '#143fff',
                    fontSize: 20,
                  }}>{user?.details?.first_name} {user?.details?.last_name}</Text>
                  <Text style={{
                    fontWeight: '500',
                    color: '#A1A3B0',
                    fontSize: 16,
                  }}>{user?.details?.phone}</Text>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: '#cbd3f5', width: 90, height: 25, borderRadius: 10}}>
                  <Text style={{
                      fontWeight: '500',
                      color: '#ffffff',
                      fontSize: 14,
                    }}>{wallet?.details?.montant} HTG</Text>
                </View>
                <View style={{alignItems:'center', paddingVertical: 7}}>
                  <TouchableOpacity onPress={() => navigation.navigate('ProfileUpdate')} style={{width: 130, height: 40, borderWidth: 1, borderRadius: 10, borderColor: '#ff8612', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{
                    fontWeight: '700',
                    color: '#ff8612',
                    fontSize: 14,
                  }}>Edit profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>
          <View style={{justifyContent: 'center'}}>
              <View style={{alignItems: 'center', borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: '#cacaca', paddingVertical: 18}}>
                  <View style={{padding: 8}}>
                    <TouchableOpacity style={{width: width / 1.1, backgroundColor: '#ffffff', elevation: 3, justifyContent: 'center', borderRadius: 12, padding: 15}}>
                        <View style={{flexDirection: 'row', padding: 5, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Feather name="users" size={20} style={{ color: '#143fff' }} />
                                </View>
                                <View style={{justifyContent: 'center', paddingHorizontal: 10}}>
                                    <Text style={{
                                        color: '#003',
                                        fontWeight: '700',
                                        fontSize: 16,
                                    }}>Option click</Text>
                                </View>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <AntDesign name="right" size={20} style={{ color: '#143fff' }} />
                            </View>
                        </View>
                      </TouchableOpacity>
                  </View>
                  <View style={{padding: 8}}>
                    <TouchableOpacity style={{width: width / 1.1, backgroundColor: '#ffffff', elevation: 3, justifyContent: 'center', borderRadius: 12, padding: 15}}>
                        <View style={{flexDirection: 'row', padding: 5, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Feather name="users" size={20} style={{ color: '#143fff' }} />
                                </View>
                                <View style={{justifyContent: 'center', paddingHorizontal: 10}}>
                                    <Text style={{
                                        color: '#003',
                                        fontWeight: '700',
                                        fontSize: 16,
                                    }}>Option click</Text>
                                </View>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <AntDesign name="right" size={20} style={{ color: '#143fff' }} />
                            </View>
                        </View>
                      </TouchableOpacity>
                  </View>
                  <View style={{padding: 8}}>
                    <TouchableOpacity style={{width: width / 1.1, backgroundColor: '#ffffff', elevation: 3, justifyContent: 'center', borderRadius: 12, padding: 15}}>
                        <View style={{flexDirection: 'row', padding: 5, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Feather name="users" size={20} style={{ color: '#143fff' }} />
                                </View>
                                <View style={{justifyContent: 'center', paddingHorizontal: 10}}>
                                    <Text style={{
                                        color: '#003',
                                        fontWeight: '700',
                                        fontSize: 16,
                                    }}>Option click</Text>
                                </View>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <AntDesign name="right" size={20} style={{ color: '#143fff' }} />
                            </View>
                        </View>
                      </TouchableOpacity>
                  </View>
                  <View style={{padding: 8}}>
                    <TouchableOpacity style={{width: width / 1.1, backgroundColor: '#ffffff', elevation: 3, justifyContent: 'center', borderRadius: 12, padding: 15}}>
                        <View style={{flexDirection: 'row', padding: 5, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Feather name="users" size={20} style={{ color: '#143fff' }} />
                                </View>
                                <View style={{justifyContent: 'center', paddingHorizontal: 10}}>
                                    <Text style={{
                                        color: '#003',
                                        fontWeight: '700',
                                        fontSize: 16,
                                    }}>Option click</Text>
                                </View>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <AntDesign name="right" size={20} style={{ color: '#143fff' }} />
                            </View>
                        </View>
                      </TouchableOpacity>
                  </View>
                  <View style={{padding: 8}}>
                    <TouchableOpacity style={{width: width / 1.1, backgroundColor: '#ffffff', elevation: 3, justifyContent: 'center', borderRadius: 12, padding: 15}}>
                        <View style={{flexDirection: 'row', padding: 5, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Feather name="users" size={20} style={{ color: '#143fff' }} />
                                </View>
                                <View style={{justifyContent: 'center', paddingHorizontal: 10}}>
                                    <Text style={{
                                        color: '#003',
                                        fontWeight: '700',
                                        fontSize: 16,
                                    }}>Option click</Text>
                                </View>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <AntDesign name="right" size={20} style={{ color: '#143fff' }} />
                            </View>
                        </View>
                      </TouchableOpacity>
                  </View>
                  <View style={{padding: 8}}>
                    <TouchableOpacity style={{width: width / 1.1, backgroundColor: '#ffffff', elevation: 3, justifyContent: 'center', borderRadius: 12, padding: 15}}>
                        <View style={{flexDirection: 'row', padding: 5, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center'}}>
                                    <Feather name="users" size={20} style={{ color: '#143fff' }} />
                                </View>
                                <View style={{justifyContent: 'center', paddingHorizontal: 10}}>
                                    <Text style={{
                                        color: '#003',
                                        fontWeight: '700',
                                        fontSize: 16,
                                    }}>Option click</Text>
                                </View>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <AntDesign name="right" size={20} style={{ color: '#143fff' }} />
                            </View>
                        </View>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
          <View style={{paddingVertical: 18, alignItems: 'center'}}>
            <TouchableOpacity
            onPress={() => {
              Alert.alert(
                  'Se Déconnecter',
                  'Es-tu sûr? De vouloir se déconnecter?',
                  [
                    {
                      text: 'Annuler',
                      onPress: () => {
                        return null;
                      },
                    },
                    {
                      text: 'Confirmer',
                      onPress: () => {
                        removeUserSession();
                        navigation.replace('SplashScreen');
                      },
                    },
                  ],
                  {cancelable: false},
                );
              
            }}
             style={{width: width / 1.1, borderWidth: 1, borderColor: 'red', borderRadius: 10, alignItems: 'center', justifyContent: 'center', padding: 15}}>
                  <Text style={{
                      color: 'red',
                      fontWeight: '700',
                      fontSize: 14,
                  }}>Déconnexion</Text>
              </TouchableOpacity>
          </View>
          <View style={{height: 50}}/>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#ffffff'
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
});

export default ProfileScreen;