import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  AsyncStorage,
} from 'react-native';

const Spin = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <ActivityIndicator
        color="#ff8612"
        size="large"
        style={{ alignItems: 'center' }}
      />
    </View>
  );
};

export default Spin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
