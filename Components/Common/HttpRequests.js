import axios from 'axios';

const url = 'https://crazy-taxi.quizapay.com/api/';
// const url = 'http://127.0.0.1:8000/api/';

const getProfile = (token) =>
  axios
    .get(
      `${url}profile/`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

const GetUser = (token) =>
  axios
    .get(
      `${url}user/`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

const getWallet = (token) =>
  axios
    .get(
      `${url}wallet/`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);
// .catch(error => {
//     removeUserSession()
// });

const getRetrait = (token) =>
  axios
    .get(
      `${url}retrait/`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

const getDemande = (token) =>
  axios
    .get(
      `${url}demande/`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

const getDriverOnline = (token, driver) =>
  axios
    .get(
      `${url}onlines/?driver=${driver}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

const getBidPrix = (token, biddetail_id) =>
  axios
    .get(
      `${url}bid-prix/?bid_id=${biddetail_id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

const getTripInfo = (token, biddetail_id, biddetail_driver) =>
  axios
    .get(
      `${url}user-driver-attemp/?id_trip=${biddetail_id}&id_driver=${biddetail_driver}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

  const getClientInfo = (token, biddetail_id) =>
    axios
      .get(
        `${url}driver-attemp/?id_trip=${biddetail_id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
        { withCredentials: true }
      )
      .then((res) => res.data);

    const getDriverBidChoose = (token, biddetail_id) =>
      axios
        .get(
          `${url}driver-bid-choose/?id_trip=${biddetail_id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
          { withCredentials: true }
        )
        .then((res) => res.data);

const getDriverInfo = (token, biddetail_driver) =>
  axios
    .get(
      `${url}get-driver/?id_driver=${biddetail_driver}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

const getTransaction = (token) =>
    axios
      .get(
        `${url}user-transactions/`,
        {
          headers: {
            authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
        { withCredentials: true }
      )
      .then((res) => res.data);

const getTrips = (token) =>
      axios
        .get(
          `${url}user-trips/`,
          {
            headers: {
              authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
          { withCredentials: true }
        )
        .then((res) => res.data);
//parti POST
const postHandleLogin = (dataBody) =>
  axios
    .post(
      `${url}auth/login`,
      dataBody,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);
const postHandleSignup = (dataBody) =>
  axios
    .post(
      `${url}auth/register`,
      dataBody,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

const postUserOnline = (token, dataBody) =>
  axios.post(
      `${url}onlines/`, dataBody,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    );

const postUserInfoStart = (token, dataBody) =>
  axios
    .post(
      `${url}info-user/`,
      dataBody,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

const postUserLocation = (token, dataBody) =>
  axios.post(
    `${url}users-locations/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/*',
        'Content-Type': 'multipart/form-data',
      },
    },
    { withCredentials: true }
  );

const postUserType = (token, dataBody) =>
  axios.post(
    `${url}change-user-type/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/*',
        'Content-Type': 'multipart/form-data',
      },
    },
    { withCredentials: true }
  );

const postTrip = (token, dataBody) =>
  axios
    .post(
      `${url}trips/`,
      dataBody,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      { withCredentials: true }
    )
    .then((res) => res.data);

const postDriverPrix = (token, dataBody) =>
  axios.post(
    `${url}driver-prix/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

  const postAddKous = (token, dataBody) =>
  axios.post(
    `${url}add-kous/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

  const postRecharge = (token, dataBody) =>
  axios.post(
      `${url}depot/`,
      dataBody,
      {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((res) => res.data);

const postUserInstruction = (token, dataBody) =>
  axios.post(
    `${url}user-instructions/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

const postQuitUserBid = (token, dataBody) =>
  axios.post(
    `${url}rider-quits/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

const postQuitDriverBid = (token, dataBody) =>
  axios.post(
    `${url}driver-quits/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

const postChooseUserBid = (token, dataBody) =>
  axios.post(
    `${url}driver-choose/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

const postAcceptUserBid = (token, dataBody) =>
  axios.post(
    `${url}driver-accept/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

const postViewDriverBid = (token, dataBody) =>
  axios.post(
    `${url}driver-arrival-comfirm/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

const postEndFinale = (token, dataBody) =>
  axios.post(
    `${url}driver-end-finale/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

  const postEnd = (token, dataBody) =>
  axios.post(
    `${url}driverEnd/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

const postDriverArival = (token, dataBody) =>
  axios.post(
    `${url}driver-arrival/`,
    dataBody,
    {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    { withCredentials: true }
  );

export default {
  GetUser,
  postHandleLogin,
  postHandleSignup,
  postUserOnline,
  postUserInfoStart,
  postDriverPrix,
  postRecharge,
  postAddKous,
  postUserInstruction,
  postDriverArival,
  postQuitUserBid,
  postQuitDriverBid,
  postChooseUserBid,
  postAcceptUserBid,
  postViewDriverBid,
  postEnd,
  postEndFinale,
  postUserLocation,
  postTrip,
  postUserType,
  getProfile,
  getDemande,
  getDriverOnline,
  getWallet,
  getRetrait,
  getBidPrix,
  getTripInfo,
  getClientInfo,
  getDriverBidChoose,
  getDriverInfo,
  getTransaction,
  getTrips
};
