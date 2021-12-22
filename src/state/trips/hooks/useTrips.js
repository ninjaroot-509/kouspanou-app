import { useState } from 'react';
import { useStateValue } from '../../index';
import httpRequest from '../../../../Components/Common/HttpRequests';
import {getToken} from '../../../../Components/Common/Auth/Sessions';

const LIST_TRIPS = 'trips/LIST_TRIPS';

const useTrips = () => {
  const [{ trips }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const request = async () => {
    setIsLoading(true);
    const token = await getToken()
    const response = await httpRequest.getTrips(token);

    if (response) {
      dispatch({
        type: LIST_TRIPS,
        payload: response,
      });
    } else {
      const err = [];
      dispatch({
        type: LIST_TRIPS,
        payload: err,
      });
    }
    setIsLoading(false);
  };

  return [trips, isLoading, request];
};

export default useTrips;
