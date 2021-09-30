import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  StatusBar,
} from 'react-native';
import Constants from 'expo-constants';
import { Card } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome } from 'react-native-vector-icons';
import {
  getUser,
  removeUserSession,
} from '../../Components/Common/Auth/Sessions';
import request from '../../Components/Common/HttpRequests';

export default function Profile({ navigation, route }) {
  const [user, setUser] = React.useState([]);
  const [profile, setProfile] = React.useState([]);
  const [wallet, setWallet] = React.useState([]);
  const pk = 'user.id';
  React.useEffect(() => {
    getUser().then((res) => setUser(res));
    request.getProfile(pk).then((res) => setProfile(res));
    request.getWallet(pk).then((res) => setWallet(res));
  });
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#ff8612'} />
      <SafeAreaView style={styles.header}>
        <View style={styles.headertitle}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              left: -10,
              backgroundColor: '#fff',
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 3,
            }}>
            <FontAwesome
              name="arrow-left"
              size={17}
              style={{ color: '#ff8612' }}
            />
          </TouchableOpacity>
          <Text
            style={{ fontWeight: 'bold', color: '#fff', fontSize: 20 }}
            numberOfLines={1}
            ellipsizeMode="tail">
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: '#143FFF',
              }}>
              {user.first_name}
            </Text>{' '}
            's Profile
          </Text>
        </View>
      </SafeAreaView>

      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 3,
          position: 'absolute',
          top: 110,
        }}>
        <View
          style={{
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: 153,
              height: 153,
              borderWidth: 4,
              borderColor: '#fff',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 6,
            }}>
            <Image
              style={{ width: 150, height: 150, borderRadius: 20 }}
              placeholderColor="#ff8612"
              source={{
                uri: 'https://mdbootstrap.com/img/new/standard/nature/121.jpg',
              }}
            />
            <TouchableOpacity
              onPress={() => null}
              style={{
                width: 35,
                height: 35,
                backgroundColor: '#143FFF',
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                bottom: -15,
              }}>
              <FontAwesome
                name="pencil"
                size={15}
                style={{ color: '#ff8612' }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ top: 15, alignItems: 'center' }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#143FFF',
                position: 'relative',
                elevation: 5,
                borderRadius: 10,
                padding: 4,
              }}>
              <Text style={{ color: '#fff', fontWeight: '500' }}>
                {wallet.montant} Gourdes
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ top: 140 }}>
        <TouchableOpacity activeOpacity={0.7}
          style={{
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderBottomColor: '#cacaca',
            borderTopColor: '#cacaca',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#fff',
            position: 'relative',
            elevation: 2,
            height: 50,
          }}>
          <FontAwesome
            name="pencil"
            size={20}
            style={{ color: '#ff8612', margin: 12 }}
          />
          <View
            style={{
              justifyContent: 'center',
            }}>
            <Text>Recharger mon compte</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#cacaca',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#fff',
            position: 'relative',
            elevation: 2,
            height: 50,
          }}>
          <FontAwesome
            name="pencil"
            size={20}
            style={{ color: '#ff8612', margin: 12 }}
          />
          <View
            style={{
              justifyContent: 'center',
            }}>
            <Text>Recharger mon compte</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#cacaca',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#fff',
            position: 'relative',
            elevation: 2,
            height: 50,
          }}>
          <FontAwesome
            name="pencil"
            size={20}
            style={{ color: '#ff8612', margin: 12 }}
          />
          <View
            style={{
              justifyContent: 'center',
            }}>
            <Text>Recharger mon compte</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#cacaca',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#fff',
            position: 'relative',
            elevation: 2,
            height: 50,
          }}>
          <FontAwesome
            name="pencil"
            size={20}
            style={{ color: '#ff8612', margin: 12 }}
          />
          <View
            style={{
              justifyContent: 'center',
            }}>
            <Text>Recharger mon compte</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#cacaca',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#fff',
            position: 'relative',
            elevation: 2,
            height: 50,
          }}>
          <FontAwesome
            name="pencil"
            size={20}
            style={{ color: '#ff8612', margin: 12 }}
          />
          <View
            style={{
              justifyContent: 'center',
            }}>
            <Text>Recharger mon compte</Text>
          </View>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    padding: 0,
    backgroundColor: 'white',
  },
  header: {
    height: '30%',
    backgroundColor: '#ff8612',
    alignItems: 'center',
    // elevation: 3,
  },
  headertitle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 285,
    height: 40,
    top: 25,
  },
});
