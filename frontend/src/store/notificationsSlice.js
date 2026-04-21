import { createSlice, nanoid } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
  },
  reducers: {
    addNotification: {
      reducer(state, action) {
        state.list.push(action.payload);
      },
      prepare({ title, message, type = 'info' }) { // type can be 'info', 'success', 'error'
        return {
          payload: {
            id: nanoid(),
            title,
            message,
            type,
          },
        };
      },
    },
    dismissNotification(state, action) {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addNotification, dismissNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;