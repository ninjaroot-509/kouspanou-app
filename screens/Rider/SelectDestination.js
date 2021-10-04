import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import PlacesInput from 'react-native-places-input';

const SelectDestination = ({ navigation }) => {
  const handleChoose = (item) => {
    navigation.navigate('Book', { zone: item });
  };
  return (
    <View style={styles.container}>
      <View>
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
            <PlacesInput
              googleApiKey="AIzaSyAwUfhJQ4jDgFcJR1ahGeP1zceMTLIMTkc"
              placeHolder={'Où allez vous!?'}
              language={'fr-FR'}
              queryCountries={['ht']}
              onSelect={(place) => {
                // handleChoose({ item: place.result });
                console.log(place);
              }}
              stylesList={{
                borderColor: '#dedede',
                borderBottomWidth: 1,
              }}
              stylesContainer={{
                position: 'relative',
                alignSelf: 'stretch',
                margin: 0,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                shadowOpacity: 0,
                borderColor: '#dedede',
                borderWidth: 0.4,
                marginBottom: 10,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

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
    alignItems: 'center',
    justifyContent: 'center',
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
});
