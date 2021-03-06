const initialState = {
  notifications: [],
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NOTIFICATIONS_RECEIVED':
      return { ...state, notifications: action.payload };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload].concat(state.notifications) };

    case 'RESET_NOTIFICATIONS':
      return { ...state, ...initialState };

    default: {
      return state;
    }
  }
};

export default notificationReducer;
