import axios from 'axios';
import {
  getToken,
  // removeUserSession
} from './Auth/Sessions';

const url = 'https://crazy-taxi.quizapay.com/api/';
// const url = 'http://127.0.0.1:8000/api/';
const config = { headers: { 'Content-Type': 'application/json' } };

const getProfile = (pk) =>
  axios.get(`${url}profile/?pk=${pk}`, config).then((res) => res.data);
const GetUser = (pk) => axios.get(`${url}user/?pk=${pk}`, config).then((res) => res.data);
const getWallet = (pk) => axios.get(`${url}wallet/?pk=${pk}`, config).then((res) => res.data);
// .catch(error => {
//     removeUserSession()
// });
const getRetrait = (pk) =>
  axios.get(`${url}retrait/?pk=${pk}`, config).then((res) => res.data);
const getDemande = (pk) =>
  axios.get(`${url}demande/?pk=${pk}`, config).then((res) => res.data);
const getDriverOnline = (pk, driver) =>
  axios
    .get(`${url}onlines/?pk=${pk}&driver=${driver}`, config)
    .then((res) => res.data);
    
const getBidPrix = (pk, id) =>
    axios
      .get(`${url}bid-prix/?pk=${pk}&id=${id}`, config)
      .then((res) => res.data);
//parti POST
const postInfo = (pk, last_name, first_name) =>
  axios
    .post(
      `${url}info-user/?pk=${pk}`,
      JSON.stringify({
        last_name: last_name,
        first_name: first_name,
      }),
      config
    )
    .then((res) => res.data);
const postUserOnline = (pk) => axios.post(`${url}onlines/?pk=${pk}`);

const postUserLocation = (pk, latitude, longitude, place_name) =>
  axios.post(
    `${url}users-locations/?pk=${pk.pk}&latitude=${pk.latitude}&longitude=${pk.longitude}&place_name=${pk.place_name}`
  );

const postUserType = (pk, is_driver, is_passenger) =>
  axios
    .post(
      `${url}change-user-type/?pk=${pk.pk}&is_driver=${pk.is_driver}&is_passenger=${pk.is_passenger}`
    )

const postTrip = (pk, longitude, latitude, destination_id, payMN) =>
  axios
    .post(
      `${url}trips/?pk=${pk}`,
      JSON.stringify({
        longitude: longitude,
        latitude: latitude,
        destination_id: destination_id,
        payMN: payMN,
      }),
      config
    ).then((res) => res.data).catch((err) => {
      // console.log(err, pk, longitude, latitude, destination_id, payMN)
    })

    const postDriverPrix = (pk, id_trip, prix) =>
      axios
        .post(
          `${url}driver-prix/?pk=${pk}`,
          JSON.stringify({
            id_trip: id_trip,
            prix: prix,
          })
        )
      
    const postUserInstruction = (pk, id_trip, prix) =>
        axios
          .post(
            `${url}user-instructions/?pk=${pk}`,
            JSON.stringify({
              id_trip: id_trip,
              message: prix,
            })
          )

export default {
  GetUser,
  postUserOnline,
  postDriverPrix,
  postUserInstruction,
  postUserLocation,
  postTrip,
  postUserType,
  getProfile,
  getDemande,
  getDriverOnline,
  getWallet,
  getRetrait,
  getBidPrix
};
