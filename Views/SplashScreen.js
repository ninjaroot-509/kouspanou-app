import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, Image } from 'react-native';
import { getToken, getUser, getComand } from '../Components/Common/Auth/Sessions';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      token: null,
      comand: null,
      animating: true
    };
  }
  UNSAFE_componentWillMount() {}

  componentDidMount() {
    this.handleGetUser();
    this.handleGetToken();
    this.handleGetComand();
    setTimeout(() => {
      this.setState({ animating: false })
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen Auth
      if (this.state.token) {
        // console.log(this.state.user);
        if (this.state.user.is_complete === true) {
          if (this.state.user.is_passenger === true && this.state.user.is_driver === false) {
              if (this.state.comand === null) {
                this.props.navigation.replace('DrawerNavigationRoutes');
              } else {
                if (this.state.comand.is_active === true) {
                  this.props.navigation.replace('BidRider');
                } else {
                  if (this.state.comand.arrival === true) {
                    this.props.navigation.replace('DestRider');
                  } else {
                    this.props.navigation.replace('BidRiderTrafic');
                  }
                }
              }
          } else if (this.state.user.is_passenger === false && this.state.user.is_driver === true) {
              if (this.state.comand === null) {
                this.props.navigation.replace('NavigationRoutesDriver');
              } else {
                if (this.state.comand.is_active === true) {
                  this.props.navigation.replace('BidDriver');
                } else {
                  if (this.state.comand.arrival === true) {
                    this.props.navigation.replace('DestDriver');
                  } else {
                    this.props.navigation.replace('BidDriverTrafic');
                  }
                }
              }
          } else {
            this.props.navigation.replace('Out');
          }
        } else if (this.state.user.is_complete === false) {
          this.props.navigation.replace('CompleteI');
        } else {
          this.props.navigation.replace('SplashScreen');
        }
      } else {
        this.props.navigation.navigate("OnBoard")
      }
    }, 2000);
  }

  async handleGetUser() {
    await getUser().then(user => this.setState({ user: user }));
  }
  async handleGetToken() {
    await getToken().then(token => this.setState({ token: token }));
  }
  async handleGetComand() {
    await getComand().then(comand => this.setState({ comand: comand }));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{padding: 20}}>
          <Image
            style={{
              width: 240,
              height: 240,
            }}
            source={require('../assets/logo.png')}//changement du logo 
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});