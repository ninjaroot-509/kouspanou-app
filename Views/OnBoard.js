import React from 'react';
import { Image, View, Button, TouchableOpacity, Text } from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';

const backgroundColor = (isLight) => (isLight ? 'blue' : 'lightblue');
const color = (isLight) => backgroundColor(!isLight);

const Done = ({ isLight, ...props }) => (
  <TouchableOpacity
    style={{
      margin: 10,
      padding: 7,
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70,
      backgroundColor: backgroundColor(isLight),
    }}
    textStyle={{ color: color(isLight) }}
    {...props}>
    <Text>Continuer</Text>
  </TouchableOpacity>
);

const Skip = ({ isLight, skipLabel, ...props }) => (
  <TouchableOpacity
    style={{
      margin: 10,
      padding: 7,
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70,
      backgroundColor: backgroundColor(isLight),
    }}
    textStyle={{ color: color(isLight) }}
    {...props}>
    <Text>Passer</Text>
  </TouchableOpacity>
);

const Next = ({ isLight, ...props }) => (
  <TouchableOpacity
    style={{
      margin: 10,
      padding: 7,
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70,
      backgroundColor: backgroundColor(isLight),
    }}
    textStyle={{ color: color(isLight) }}
    {...props}>
    <Text>Suivant</Text>
  </TouchableOpacity>
);

const CustomButtons = ({navigation}) => (
  <Onboarding
    NextButtonComponent={Next}
    SkipButtonComponent={Skip}
    DoneButtonComponent={Done}
    onDone={() => navigation.navigate('Auth')}
    onSkip={() => navigation.navigate('Auth')}
    bottomBarColor={'white'}
    titleStyles={{ color: 'blue' }} // set default color for the title
    pages={[
      {
        backgroundColor: '#fff',
        image: (
          <Image
            style={{ width: 300, height: 245 }}
            source={require('../assets/logo.png')}
          />
        ),
        title: 'Hello!',
        subtitle: 'Bienvenue sur crazy-taxi online',
        titleStyles: { color: '#ff8612' }, // overwrite default color
      },
      {
        backgroundColor: '#ff8612',
        image: (
          <Image
            style={{ width: 300, height: 200 }}
            source={require('../assets/logo.png')}
          />
        ),
        title: 'Hello!',
        subtitle: 'Bienvenue sur crazy-taxi online',
      },
      {
        backgroundColor: '#fff',
        image: (
          <Image
            style={{ width: 300, height: 200 }}
            source={require('../assets/logo.png')}
          />
        ),
        title: 'Hello!',
        subtitle: 'Bienvenue sur crazy-taxi online',
      },
    ]}
  />
);

export default CustomButtons;
