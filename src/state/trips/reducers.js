const LIST_TRIPS = 'trips/LIST_TRIPS';

export const INITIAL_STATE = {
  list: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIST_TRIPS:
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};
