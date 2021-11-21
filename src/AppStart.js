import Constants from 'expo-constants';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Platform } from 'react-native';

import Out from '../Views/Out';
import Spin from '../Views/Spin';
import Login from '../Views/Login';
import Signup from '../Views/Signup';
import CompleteI from '../Views/CompleteI';
import Recharge from '../Views/Recharge';
import AddKous from '../Views/AddKous';
import Retrait from '../Views/Retrait';
import RecentTrip from '../Views/RecentTrip';
import BidRider from '../screens/Rider/BidRider';
import BidRiderTrafic from '../screens/Rider/BidRiderTrafic';
import DestRider from '../screens/Rider/DestRider';
import DestDriver from '../screens/Driver/DestDriver';
import Home from '../screens/Rider/Home';
import Pickup from '../screens/Rider/SelectDestination';
import Book from '../screens/Rider/Book';
import HomeDriver from '../screens/Driver/Home';
import BidDriver from '../screens/Driver/BidDriver';
import BidDriverTrafic from '../screens/Driver/BidDriverTrafic';
import Profile from '../screens/Rider/Profile';
import ProfileUpdate from '../screens/Rider/ProfileUpdate';
import Explore from '../screens/Rider/Explore';
import Notification from '../screens/Rider/Notification';
import Check from '../Views/Check';
import Preface from '../Views/Preface';
import SplashScreen from '../Views/SplashScreen';
import OnBoard from '../Views/OnBoard';
import { getToken, getUser } from '../Components/Common/Auth/Sessions';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Linking } from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import 'moment/locale/fr';
import request from '../Components/Common/HttpRequests';
import useUsers from '../src/state/user/hooks/useUsers';

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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStackRider() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Pickup"
        component={Pickup}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Book"
        component={Book}
      />
    </Stack.Navigator>
  );
}

function MyTabRider({ navigation, route }) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: true, //<=====
      }}
      tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeStackRider}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Pickup"
        component={Pickup}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Notification"
        component={Notification}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
}

function HomeStackDriver() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeDriver}
      />
    </Stack.Navigator>
  );
}

function MyTabDriver({ navigation, route }) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: true, //<=====
      }}
      tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeStackDriver}
      />
      {/*<Tab.Screen
        options={{ headerShown: false }}
        name="Pickup"
        component={Explore}
      />*/}
      <Tab.Screen
        options={{ headerShown: false }}
        name="Notification"
        component={Notification}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
}

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          height: 50,
          elevation: 3,
          width: '100%',
        }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          let iconName;
          let size = 20;
          let color = isFocused ? '#ff8612' : '#143FFF';
          if (label === 'Home') {
            iconName = isFocused ? 'ios-home-sharp' : 'ios-home-outline';
          } else if (label === 'Pickup') {
            iconName = isFocused ? 'ios-search-sharp' : 'ios-search-outline';
          } else if (label === 'Notification') {
            iconName = isFocused
              ? 'ios-notifications-sharp'
              : 'ios-notifications-outline';
          } else if (label === 'Profile') {
            iconName = isFocused ? 'ios-person-sharp' : 'ios-person-outline';
          }
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name={iconName} size={size} color={color} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const AppStart = () => {
  const [temp, setTemp] = useState(0);
  const [temp1, setTemp1] = useState(0);
  const [user, isLoading, setUsers] = useUsers();

  useEffect(() => {
    if (!user.details || user.details.length === 0) {
      setUsers();
    }
  }, [temp]);

  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 3000);
  }, []);

  useEffect(() => {
    setInterval(() => {
      setTemp1((prevTemp1) => prevTemp1 + 1);
    }, 1500000);
  }, []);

  useEffect(() => {
    if (user?.details?.length !== 0) {
      request.postUserOnline(user?.details?.id);
    }
  }, [temp1]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        {/* CompleteI Navigator: Information personelles */}
        <Stack.Screen
          name="Recharge"
          component={Recharge}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddKous"
          component={AddKous}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Retrait"
          component={Retrait}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecentTrip"
          component={RecentTrip}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompleteI"
          component={CompleteI}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileUpdate"
          component={ProfileUpdate}
          options={{ headerShown: false }}
        />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="OnBoard"
          component={OnBoard}
          options={{ headerShown: false }}
        />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={MyTabRider}
          options={{ headerShown: false }}
        />
        {/* page Driver */}
        <Stack.Screen
          name="NavigationRoutesDriver"
          component={MyTabDriver}
          options={{ headerShown: false }}
        />
        {/* page BidRider */}
        <Stack.Screen
          name="BidRider"
          component={BidRider}
          options={{ headerShown: false }}
        />
        {/* page BidRiderTrafic */}
        <Stack.Screen
          name="BidRiderTrafic"
          component={BidRiderTrafic}
          options={{ headerShown: false }}
        />
        {/* page BidDriver */}
        <Stack.Screen
          name="BidDriver"
          component={BidDriver}
          options={{ headerShown: false }}
        />
        {/* page BidDriverTrafic */}
        <Stack.Screen
          name="BidDriverTrafic"
          component={BidDriverTrafic}
          options={{ headerShown: false }}
        />
        {/* page DestRider */}
        <Stack.Screen
          name="DestRider"
          component={DestRider}
          options={{ headerShown: false }}
        />
        {/* page DestDriver */}
        <Stack.Screen
          name="DestDriver"
          component={DestDriver}
          options={{ headerShown: false }}
        />
        {/* page Out */}
        <Stack.Screen
          name="Out"
          component={Out}
          options={{ headerShown: false }}
        />
        {/* page Spin */}
        <Stack.Screen
          name="Spin"
          component={Spin}
          options={{ headerShown: false }}
        />
        {/* page Login */}
        <Stack.Screen
          options={{ headerShown: false }}
          name="Auth"
          component={Login}
        />
        {/* page Signup */}
        <Stack.Screen
          options={{ headerShown: false }}
          name="Signup"
          component={Signup}
        />
        {/* page check */}
        <Stack.Screen
          options={{ headerShown: false }}
          name="Check"
          component={Check}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppStart;
