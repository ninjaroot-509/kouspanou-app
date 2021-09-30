import { useState } from 'react';
import { useStateValue } from '../../index';
import {getComand} from '../../../../Components/Common/Auth/Sessions';

const SET_BIDDETAIL = 'biddetail/SET_BIDDETAIL';

const useBidDetails = () => {
  const [{ biddetail }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const request = async () => {
    setIsLoading(true);

    const response = await getComand()

    if (response) {
      dispatch({
        type: SET_BIDDETAIL,
        payload: response,
      });
    } else {
      const err = [];
      dispatch({
        type: SET_BIDDETAIL,
        payload: err,
      });
    }
    setIsLoading(false);
  };

  return [biddetail, isLoading, request];
};

export default useBidDetails;
