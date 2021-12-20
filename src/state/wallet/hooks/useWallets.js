import { useState } from 'react';
import { useStateValue } from '../../index';
import httpRequest from '../../../../Components/Common/HttpRequests';
import {getToken} from '../../../../Components/Common/Auth/Sessions';

const SET_WALLET = 'wallet/SET_WALLET';

const useWallets = () => {
  const [{ wallet }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const request = async () => {
    setIsLoading(true);
    const token = await getToken()
    const response = await httpRequest.getWallet(token)

    if (response) {
      dispatch({
        type: SET_WALLET,
        payload: response,
      });
    } else {
      const err = [];
      dispatch({
        type: SET_WALLET,
        payload: err,
      });
    }
    setIsLoading(false);
  };

  return [wallet, isLoading, request];
};

export default useWallets;
