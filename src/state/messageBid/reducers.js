const LIST_MESSAGEGROUP = 'messageGroup/LIST_MESSAGEGROUP';

export const INITIAL_STATE = {
  list: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIST_MESSAGEGROUP:
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};
