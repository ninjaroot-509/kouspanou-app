import React, { useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, FlatList, Image, Platform } from "react-native";
import { Ionicons } from 'react-native-vector-icons';
import { AntDesign } from 'react-native-vector-icons';
import Constants from 'expo-constants';
import { ScrollView } from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');

const NotificationList = [
    { icon: 'notification', desc: 'Coucou! Bienvenue parmi nous.', id: 1 },
    // { icon: 'notification', desc: 'lorem ipsun dolor sit amet', id: 2 },
];

export default function Notification({navigation}) {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
        <View
            style={{
                justifyContent: 'center',
                paddingLeft: 8
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
            }}>Notification</Text>
        </View>
        <View style={{width: 24}}/>
      </View>
      <ScrollView style={styles.body}>
        <View style={{paddingVertical: 20}}>
        <FlatList
            style={{}}
            horizontal={false}
            data={NotificationList}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => {
            return (
            <View style={{paddingVertical: 5, alignItems: 'center'}}>
              <View style={{flexDirection: 'row', backgroundColor: '#ffffff', elevation: 2, borderRadius: 10, justifyContent: 'space-between', width: width / 1.15, paddingHorizontal: 15}}>
                  <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 20}}>
                    <AntDesign name={item.icon} size={26} style={{ color: '#007' }} />
                  </View>
                  <View style={{justifyContent: 'center', width: width / 1.6, padding: 3}}>
                    <Text style={{
                      fontWeight: '500',
                      color: '#007',
                      fontSize: 14,
                      textAlign: 'left',
                    }}>{item.desc}</Text>
                  </View>
              </View>
            </View>                    
            )}}
                />
        </View>
      </ScrollView>
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
  },
  body: {
      flex: 1
  }
})