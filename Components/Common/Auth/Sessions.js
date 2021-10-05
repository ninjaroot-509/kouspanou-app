import { AsyncStorage } from 'react-native';

export const setComand = async (comand) => {
  try {
    AsyncStorage.setItem('comand', JSON.stringify(comand));
  } catch (error) {
    console.log('SetItem error ', error);
    return null;
  }
};

export const setmergeItemComand = async (comand) => {
  try {
    AsyncStorage.mergeItem('comand', JSON.stringify(comand));
  } catch (error) {
    console.log('mergeItem error ', error);
    return null;
  }
};

export const getComand = async () => {
  const jsonValue = await AsyncStorage.getItem('comand');
  return jsonValue != null ? JSON.parse(jsonValue) : null;
};

export const removeComand = async () => {
  await AsyncStorage.removeItem('comand');
};


export const setUserSession = async (token, user) => {
  try {
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.log('SetItem error ', error);
    return null;
  }
};


export const setmergeItemUser = async (user) => {
  try {
    AsyncStorage.mergeItem('user', JSON.stringify(user));
  } catch (error) {
    console.log('mergeItem error ', error);
    return null;
  }
};

export const getToken = async () => {
  // return (await AsyncStorage.getItem('token')) || null;
  let token = '';
  try {
    token = (await AsyncStorage.getItem('token')) || null;
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return token;
};


export const getUser = async () => {
  const jsonValue = await AsyncStorage.getItem('user');
  return jsonValue != null ? JSON.parse(jsonValue) : null;
};

export const removeUserSession = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('comand');
};
