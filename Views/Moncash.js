import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import httpRequest from '../Components/Common/HttpRequests';
import { getToken } from '../Components/Common/Auth/Sessions';
import useUsers from '../src/state/user/hooks/useUsers';
import useWallets from '../src/state/wallet/hooks/useWallets';
import Modal from 'react-native-modal';

const {width, height} = Dimensions.get('window');

const Moncash = ({togleCloseModal, togleOpenModal, modal, moncashLink}) => {
    const [user, isLoading, setUsers] = useUsers();
    const [wallet, isLoadingW, setWallets] = useWallets();

    const webviewRef = useRef()
    const studpargne = 'https://crazy-taxi.quizapay.com';

    // useEffect(() => {
    //   console.log(moncashLink)
    // })

  return (
    <Modal
    isVisible={modal}
    onRequestClose={togleCloseModal}
    onBackButtonPress={togleCloseModal}>
    <View
        style={{
            flex : 1,
            justifyContent : 'center',
            alignItems : 'center',            
        }}>
            <View style={{
                backgroundColor : 'white',
                width : width / 1.1,
                height : height / 2,
            }}>
                <WebView
                style={{ flex : 1 }} 
                    ref={webviewRef}
                    source={{ uri: moncashLink}}
                    onNavigationStateChange={(event) => {
                        if (event.url === studpargne) {
                            setUsers()
                            setWallets()
                            togleCloseModal()
                        }
                    }}
                    renderLoading={() => {
                        return (
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <ActivityIndicator size="large" color="#0C3A2D" />
                            </View>
                        );
                    }}
                />
            </View>
        </View>
    </Modal>
  );
};


export default Moncash;