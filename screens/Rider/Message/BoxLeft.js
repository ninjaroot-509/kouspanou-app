import React from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Text, Image } from "react-native";
import moment from 'moment';
import { Feather } from 'react-native-vector-icons';

const BoxLeft = ({item, biddetail, handleChoose, pk}) => {
  return (
    <View style={{ paddingHorizontal: 5, padding: 10 }}>
        <View style={{ flexDirection: 'row' }}>
        <View
            style={{
            paddingHorizontal: 8,
            }}>
            <TouchableWithoutFeedback onPress={() => handleChoose(item)}>
                <View style={{width: 40.5, height: 40.5, elevation: 2, borderRadius: 16, backgroundColor: '#ffffff'}}>
                    <Image
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 16,
                        }}
                        source={{
                            uri:
                            'https://crazy-taxi.quizapay.com/' +
                            item.user_photo,
                        }}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
        <View>
            <View
            style={{
                backgroundColor: '#143fff',
                borderRadius: 10,
                padding: 8,
                minWidth: 50,
                maxWidth: 200,
                elevation: 1.5,
            }}>
            <View
                style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                }}>
                <Text
                style={{
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: '700',
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.user_first_name} {item.user_last_name}
                </Text>
                {biddetail?.details?.client === pk &&
                biddetail?.details?.choose == false && (
                    <TouchableOpacity
                    onPress={() => handleChoose(item)}
                    style={{
                        width: 20,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ff9612',
                        borderRadius: 18,
                        marginHorizontal: 10,
                    }}>
                    <Feather
                        name="user-check"
                        color="#fff"
                    />
                    </TouchableOpacity>
                )}
            </View>
            <Text
                style={{
                padding: 2,
                color: '#fff',
                fontSize: 15,
                }}>
                {item.message ? item.message : item.prix}{' '}
                {item.message ? '' : 'HTG'}
            </Text>
            </View>
        </View>
        </View>
        <View style={{flexDirection: 'row', paddingLeft: 55}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
                style={{
                    padding: 5,
                    color: '#143fff',
                    fontSize: 12,
                }}>
                {moment(item.updated_on).fromNow()}
            </Text>
            </View>
        </View>
    </View>
  );
}

export default BoxLeft;
