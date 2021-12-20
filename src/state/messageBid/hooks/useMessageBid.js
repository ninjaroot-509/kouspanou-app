import { useState } from 'react';
import { useStateValue } from '../../index';
import httpRequest from '../../../../Components/Common/HttpRequests';
import {getToken, getUser} from '../../../../Components/Common/Auth/Sessions';

const LIST_MESSAGEGROUP = 'messageGroup/LIST_MESSAGEGROUP';

const useMessageGroup = () => {
  const [{ messageGroup }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const request = async () => {
    setIsLoading(true);

    const token = await getToken()
    const user = await getUser()

    const response = await httpRequest.getCommunityMessages(token, user.community_code);

    if (response) {
      dispatch({
        type: LIST_MESSAGEGROUP,
        payload: response,
      });
    } else {
      const err = [];
      dispatch({
        type: LIST_MESSAGEGROUP,
        payload: err,
      });
    }
    setIsLoading(false);
  };

  return [messageGroup, isLoading, request];
};

export default useMessageGroup;
