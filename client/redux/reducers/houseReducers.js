const initialState = {
  id: 0, // here because of db, only reference user's houseId
  name: '',
  key: '',
  roomies: [],
  readyToJoinSocket: false,
};

const houseReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_HOUSE':
      console.log(`${action.payload}`);
      return { ...state, ...action.payload };

    case 'RESET_HOUSE':
      return { ...state, ...initialState };

    default: {
      return state;
    }
  }
};

export default houseReducer;
