const LIST_DRIVERONLINE = 'driveronline/LIST_DRIVERONLINE';

export const INITIAL_STATE = {
  list: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIST_DRIVERONLINE:
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};
