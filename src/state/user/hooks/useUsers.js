import { useState } from 'react';
import { useStateValue } from '../../index';
import {getUser} from '../../../../Components/Common/Auth/Sessions';

const SET_USER = 'user/SET_USER';

const useUsers = () => {
  const [{ user }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const request = async () => {
    setIsLoading(true);

    const response = await getUser()

    if (response) {
      dispatch({
        type: SET_USER,
        payload: response,
      });
    } else {
      const err = [];
      dispatch({
        type: SET_USER,
        payload: err,
      });
    }
    setIsLoading(false);
  };

  return [user, isLoading, request];
};

export default useUsers;
