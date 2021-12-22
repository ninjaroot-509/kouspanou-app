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
  Platform
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import { FontAwesome } from 'react-native-vector-icons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { AntDesign } from 'react-native-vector-icons';
import Constants from 'expo-constants';
import { FontAwesome5 } from 'react-native-vector-icons';
import { Ionicons } from 'react-native-vector-icons';
import moment from 'moment';
import { Entypo } from 'react-native-vector-icons';
// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import useTrips from '../src/state/trips/hooks/useTrips';
const {width, height} = Dimensions.get('window');

const RecentTripScreen = ({ navigation }) => {
  const [trips, isLoading, setTrips] = useTrips();

  useEffect(() => {
    if (!trips?.list || trips?.list?.length === 0) {
      setTrips();
    }
  }, [setTrips, trips]);

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
                  style={{ color: '#009' }}
                />
              </TouchableOpacity>
        </View>
        <View 
        style={{
            justifyContent: 'center'
            }}>
            <Text 
            style={{
                color: '#001',
                fontSize: 17,
                fontWeight: '700',
            }}>Voyage récent</Text>
        </View>
        <View style={{width: 24}}/>
      </View>
        <ScrollView style={{flex: 1}}>
          <View style={{paddingVertical: 15}}>
              <View style={{}}>
              {trips?.list?.length !== 0?
                <FlatList
                  style={{paddingHorizontal: 14}}
                    horizontal={false}
                    data={trips?.list}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity style={{ borderBottomWidth: 0.7, borderColor: '#cacaca', justifyContent: 'center' }}> 
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
                                    color: '#ff8612',
                                    fontSize: 16,
                                    textAlign: 'left',
                                  }}>
                                  {item.destination_place_name}
                                </Text>
                                <Text
                                  style={{
                                    fontWeight: '500',
                                    color: '#143fff',
                                    fontSize: 14,
                                    textAlign: 'left',
                                  }}>
                                    {moment(item.created_on).fromNow()}
                                </Text>
                              </View>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                              {item.prix && (
                                <Text
                                  style={{
                                      fontWeight: '700',
                                      color: '#ff861290',
                                      fontSize: 16,
                                      textAlign: 'left',
                                  }}>
                                  {item.prix} HTG
                                </Text>
                              )}
                                <Text
                                style={{
                                    fontWeight: '700',
                                    color: item.is_complete === true? 'green' : '#A1A3B070',
                                    fontSize: 14,
                                    textAlign: 'left',
                                }}>
                                  {item.is_complete === true? 'Succès' : 'En cours'}
                                </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                />
                :
                  <View style={{alignItems: 'center'}}>
                    <View style={{backgroundColor: '#cacaca', padding: 11, borderRadius: 12}}>
                      <Text
                        style={{
                            fontWeight: '700',
                            color: 'red',
                            fontSize: 14,
                        }}>
                        pas encore de voyage
                      </Text>
                    </View>
                  </View>
              }
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