import { useState } from 'react';
import { useStateValue } from '../../index';
import httpRequest from '../../../../Components/Common/HttpRequests';
import {getToken} from '../../../../Components/Common/Auth/Sessions';

const LIST_TRANSACTIONS = 'transactions/LIST_TRANSACTIONS';

const useTransactions = () => {
  const [{ transactions }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const request = async () => {
    setIsLoading(true);
    const token = await getToken()
    const response = await httpRequest.getTransaction(token);

    if (response) {
      dispatch({
        type: LIST_TRANSACTIONS,
        payload: response,
      });
    } else {
      const err = [];
      dispatch({
        type: LIST_TRANSACTIONS,
        payload: err,
      });
    }
    setIsLoading(false);
  };

  return [transactions, isLoading, request];
};

export default useTransactions;
