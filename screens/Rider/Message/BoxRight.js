import React from 'react';
import { View, TouchableOpacity, Text, Image } from "react-native";
import moment from 'moment';

const BoxLeft = ({item}) => {
  return (
    <View style={{ paddingHorizontal: 5, padding: 10 }}>
        <View
        style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
        }}>
        <View>
            <View
            style={{
                backgroundColor: '#ff8612',
                borderRadius: 10,
                padding: 8,
                minWidth: 60,
                maxWidth: 200,
                elevation: 1.5,
            }}>
            <Text
                style={{
                color: '#fff',
                fontSize: 13,
                fontWeight: '700',
                textAlign: 'left',
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                Moi
            </Text>
            <Text
                style={{
                paddingVertical: 2,
                color: '#fff',
                fontSize: 15,
                textAlign: 'left',
                }}>
                {item.message ? item.message : item.prix}
                {item.message ? '' : 'HTG'}
            </Text>
            </View>
        </View>
        <View
            style={{
            paddingHorizontal: 8,
            }}>
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
        </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight: 45}}>
                <View style={{width: 5, height: 5}}/>
                <View>
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
    </View>
  );
}

export default BoxLeft;
