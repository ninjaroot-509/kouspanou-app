const LIST_ZONES = 'zone/LIST_ZONES';

export const INITIAL_STATE = {
  list: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIST_ZONES:
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};
