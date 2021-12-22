const LIST_TRANSACTIONS = 'transactions/LIST_TRANSACTIONS';

export const INITIAL_STATE = {
  list: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIST_TRANSACTIONS:
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};
