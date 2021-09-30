import React, { useState, useEffect, useRef } from 'react';
import { Button, Platform } from 'react-native';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_300Light,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import AppStart from './src/AppStart';
import { StateProvider } from './src/state';
import { INITIAL_STATE as USER_INITIAL_STATE } from './src/state/user/reducers';
import { INITIAL_STATE as DRIVERONLINE_INITIAL_STATE } from './src/state/driveronline/reducers';
import { INITIAL_STATE as ZONE_INITIAL_STATE } from './src/state/zone/reducers';
import { INITIAL_STATE as DEMANDE_INITIAL_STATE } from './src/state/demande/reducers';
import { INITIAL_STATE as WALLET_INITIAL_STATE } from './src/state/wallet/reducers';
import { INITIAL_STATE as BIDDETAIL_INITIAL_STATE } from './src/state/biddetail/reducers';
import reducers from './src/state/reducers';
import 'moment/locale/fr';

import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from 'react-native';

const App = (props) => {
  const initialState = {
    user: USER_INITIAL_STATE,
    driveronline: DRIVERONLINE_INITIAL_STATE,
    zone: ZONE_INITIAL_STATE,
    demande: DEMANDE_INITIAL_STATE,
    wallet: WALLET_INITIAL_STATE,
    biddetail: BIDDETAIL_INITIAL_STATE
  };
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_300Light,
    OpenSans_700Bold,
  });

  return (
    <StateProvider initialState={initialState} reducer={reducers}>
      <AppStart />
    </StateProvider>
  );
};
export default App;
