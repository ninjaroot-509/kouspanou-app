import { useState } from 'react';
import { useStateValue } from '../../index';
import httpRequest from '../../../../Components/Common/HttpRequests';

const LIST_ZONES = 'zone/LIST_ZONES';

const useZones = () => {
  const [{ zone }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const request = async () => {
    setIsLoading(true);

    const response = await httpRequest.getZones();

    if (response) {
      dispatch({
        type: LIST_ZONES,
        payload: response,
      });
    } else {
      const err = [];
      dispatch({
        type: LIST_ZONES,
        payload: err,
      });
    }
    setIsLoading(false);
  };

  return [zone, isLoading, request];
};

export default useZones;
