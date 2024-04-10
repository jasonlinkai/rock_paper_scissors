import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    isConnected: false,
  },
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    onSocketConnected: state => {
      state.data = {
        ...state.data,
        isConnected: true,
      }
    },
    onSocketDisconnected: state => {
      state.data = {
        ...state.data,
        isConnected: false,
      }
    },
  },
});

export const { onSocketConnected, onSocketDisconnected } = socketSlice.actions;

export const selectIsConnected = state => state.socket.isConnected;

export default socketSlice.reducer;
