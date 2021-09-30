const SET_USER = 'user/SET_USER';

export const INITIAL_STATE = {
  details: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        details: action.payload,
      };
    default:
      return state;
  }
};
