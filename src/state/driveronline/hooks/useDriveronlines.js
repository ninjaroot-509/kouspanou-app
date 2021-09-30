import { useState } from 'react';
import { useStateValue } from '../../index';
import httpRequest from '../../../../Components/Common/HttpRequests';
import {getUser} from '../../../../Components/Common/Auth/Sessions';

const LIST_DRIVERONLINE = 'driveronline/LIST_DRIVERONLINE';

const useDriveronlines = () => {
  const [{ driveronline }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const request = async () => {
    setIsLoading(true);

    const user = await getUser()

    const response = await httpRequest.getDriverOnline(user.id, true);

    if (response) {
      dispatch({
        type: LIST_DRIVERONLINE,
        payload: response,
      });
    } else {
      const err = [];
      dispatch({
        type: LIST_DRIVERONLINE,
        payload: err,
      });
    }
    setIsLoading(false);
  };

  return [driveronline, isLoading, request];
};

export default useDriveronlines;
