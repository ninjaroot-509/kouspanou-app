const SET_BIDDETAIL = 'biddetail/SET_BIDDETAIL';

export const INITIAL_STATE = {
  details: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_BIDDETAIL:
      return {
        ...state,
        details: action.payload,
      };
    default:
      return state;
  }
};
