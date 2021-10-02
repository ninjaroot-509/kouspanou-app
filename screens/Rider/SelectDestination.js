import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import useZones from '../../src/state/zone/hooks/useZones';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createFilter } from 'react-native-search-filter';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PlacesInput from 'react-native-places-input';

const SelectDestination = ({ navigation }) => {  
  const handleChoose = (item) => {
    navigation.navigate('Book', { zone: item })
  }
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.card}>
          <View style={styles.drop}>
            <Text style={styles.dropText}>Rechercher ici</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Feather name="x" size={24} style={{ color: '#8c8d95' }} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomCard}>
            <View style={styles.bottomCardPin}>
              <View style={styles.dotCover}>
                <View style={styles.dot} />
              </View>

              <Text style={{ color: '#9fa1a7', fontSize: 16 }}>
                votre position actuelle!
              </Text>
            </View>
          </View>

          <View style={styles.search}>
            <View style={styles.inputWrapper}>
              <PlacesInput
                googleApiKey="AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc"
                placeHolder={'Où allez vous!?'}
                language={'fr-FR'}
                queryCountries={['ht']}
                onSelect={(place) => {
                  handleChoose({item: place.result})
                }}
                stylesList={{
                  borderColor: '#dedede',
                  borderBottomWidth: 1,
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

export default SelectDestination;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    padding: 20,
    marginHorizontal: 10,
    borderColor: '#efefef',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 30,
  },
  drop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropText: {
    fontWeight: 'bold',
    color: '#ff8612',
  },
  search: {
    padding: 7,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#efefef',
    borderWidth: 1.2,
  },
  inputWrapper: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#143fff',
    elevation: 3,
  },
  dotCover: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  inputText: {
    fontWeight: '600',
    width: 220,
  },
  bottomCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  bottomCardPin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonCircle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: '#143fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    paddingHorizontal: 20,
    padding: 15,
  },
  bigTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#ff8612',
    marginBottom: 20,
  },
  recentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#3a3b4b',
    marginBottom: 5,
  },
  recentSubtitle: {
    color: '#aaabb1',
  },
});
