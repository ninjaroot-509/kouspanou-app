const SET_WALLET = 'wallet/SET_WALLET';

export const INITIAL_STATE = {
  details: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        details: action.payload,
      };
    default:
      return state;
  }
};
