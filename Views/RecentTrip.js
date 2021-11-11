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
// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
const {width, height} = Dimensions.get('window');

const RecentTripScreen = ({ navigation }) => {
  const SlideHome = [
    { id: 1, picture: 'https://i.pravatar.cc/309', title: 'lorem' },
    { id: 2, picture: 'https://i.pravatar.cc/306', title: 'Test' },
    { id: 3, picture: 'https://i.pravatar.cc/303', title: 'lorem' },
    { id: 4, picture: 'https://i.pravatar.cc/304', title: 'lorem' },
    { id: 5, picture: 'https://i.pravatar.cc/305', title: 'lorem' },
    { id: 6, picture: 'https://i.pravatar.cc/306', title: 'lorem' },
    { id: 7, picture: 'https://i.pravatar.cc/307', title: 'lorem' },
    { id: 8, picture: 'https://i.pravatar.cc/308', title: 'lorem' },
  ];

  const Activity = [
    { id: 1, price: '200', date: '03/12/21' },
    { id: 2, price: '200', date: '03/12/21' },
    { id: 3, price: '200', date: '03/12/21' },
    { id: 4, price: '200', date: '03/12/21' },
    { id: 5, price: '200', date: '03/12/21' },
    { id: 6, price: '200', date: '03/12/21' },
    { id: 7, price: '200', date: '03/12/21' },
    { id: 8, price: '200', date: '03/12/21' },
  ];

  const itemWidth = (width - 15) / 2;
  const carouselRef = useRef(null);

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
        <View
            style={{
                justifyContent: 'center'
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="arrow-back"
                  size={22}
                  style={{ color: '#003' }}
                />
              </TouchableOpacity>
        </View>
        <View 
        style={{
            justifyContent: 'center'
            }}>
            <Text 
            style={{
                color: '#003',
                fontSize: 18,
                fontWeight: '700',
            }}>Voyage récent</Text>
        </View>
        <View style={{width: 24}}/>
      </View>
        <ScrollView style={{flex: 1}}>
          <View style={{paddingVertical: 15}}>
              <View style={{}}>
                <FlatList
                  style={{paddingHorizontal: 14}}
                    horizontal={false}
                    data={Activity}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity onPress={() => navigation.navigate('TransactionDetail')} style={{ borderBottomWidth: 0.7, borderColor: '#cacaca', justifyContent: 'center' }}> 
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              paddingVertical: 10
                            }}>
                              <View style={{justifyContent: 'center'}}>
                                <Text
                                  style={{
                                    fontWeight: '700',
                                    color: '#A1A3B0',
                                    fontSize: 16,
                                    textAlign: 'left',
                                  }}>
                                  Delmas 75, port-au-prince
                                </Text>
                                <Text
                                  style={{
                                    fontWeight: '500',
                                    color: '#143fff',
                                    fontSize: 14,
                                    textAlign: 'left',
                                  }}>
                                  5/21/2021
                                </Text>
                              </View>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text
                                style={{
                                    fontWeight: '700',
                                    color: '#ff8612',
                                    fontSize: 16,
                                    textAlign: 'left',
                                }}>
                                500 HTG
                                </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                />
              </View>
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
  },
});

export default RecentTripScreen;