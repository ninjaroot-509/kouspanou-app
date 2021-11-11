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
import PhoneInput from 'react-native-phone-number-input';
const {width, height} = Dimensions.get('window');

const ProfileUpdate = ({ navigation }) => {
    const phoneInput = useRef(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headertitle}>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="arrow-back"
                  size={20}
                  style={{ color: '#009' }}
                />
              </TouchableOpacity>
          </View>
          <View style={{justifyContent: 'center'}}>
            <View style={{justifyContent: 'center'}}>
                <Text style={{
                    fontWeight: '700',
                    color: '#ff8612',
                    fontSize: 14,
                  }}>sauvegarder</Text>
            </View>
          </View>
        </View>
        </View>
        <ScrollView style={{flex: 1}}>
          <View style={{justifyContent: 'center', paddingVertical: 25}}>
              <View style={{alignItems: 'center'}}>
                <View style={{alignItems: 'center'}}>
                  <Image style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50
                    }} 
                    source={require('../../assets/logo.png')}/>
                    <View style={{position: 'absolute', justifyContent: 'center', width: 100, height: 100, backgroundColor: 'rgba(0,0,255,0.2)', borderRadius: 50}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <AntDesign
                                name="camera"
                                size={19}
                                style={{ color: '#ffffff' }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{alignItems: 'center', paddingVertical: 10}}>
                  <Text style={{
                    fontWeight: '500',
                    color: '#A1A3B0',
                    fontSize: 16,
                  }}>Change Photo</Text>
                </View>
              </View>
          </View>
          <View style={{justifyContent: 'center'}}>
              <View style={{alignItems: 'center', borderTopWidth: 0.5, borderColor: '#cacaca', paddingVertical: 10}}>
                <View style={{padding: 8}}>
                    <View style={{padding: 8}}>
                        <Text style={{
                            fontWeight: '500',
                            color: '#143fff',
                            fontSize: 14,
                        }}>Nom</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <TextInput
                            placeholder={'Entrer votre nom'}
                            placeholderTextColor={'#A1A3B0'}
                            style={styles.input}
                            returnKeyType="next"
                        />
                    </View>
                </View>
                <View style={{padding: 8}}>
                    <View style={{padding: 8}}>
                        <Text style={{
                            fontWeight: '500',
                            color: '#143fff',
                            fontSize: 14,
                        }}>Prenom</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <TextInput
                            placeholder={'Entrer votre prenom'}
                            placeholderTextColor={'#A1A3B0'}
                            style={styles.input}
                            returnKeyType="next"
                        />
                    </View>
                </View>
                <View style={{padding: 8}}>
                    <View style={{padding: 8}}>
                        <Text style={{
                            fontWeight: '500',
                            color: '#143fff',
                            fontSize: 14,
                        }}>Numéro de téléphone</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <PhoneInput
                        containerStyle={{
                        width: width / 1.1,
                        height: 50,// J'ai changé pour quon que le +33 sois bien visible 
                        backgroundColor: '#ffffff',
                        borderRadius: 7
                        }}
                        textContainerStyle={{ backgroundColor: '#ffffff', color: '#A1A3B0', borderRadius: 7 }}
                        textInputStyle={{ color: '#A1A3B0' }}
                        codeTextStyle={{ color: '#A1A3B0' }}
                        flagButtonStyle={{ color: '#A1A3B0' }}
                        ref={phoneInput}
                        defaultValue={''}
                        defaultCode="HT"
                        layout="first"
                        withShadow
                        // onChangeText={(text) => {
                        //   setPhone(text);
                        // }}
                        // onChangeFormattedText={(text) => {
                        //   setFormattedValue(text);
                        // }}
                        // autoFocus
                    />
                    </View>
                </View>
              </View>
          </View>
          <View style={{height: 100}}/>
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