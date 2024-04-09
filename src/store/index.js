import { configureStore } from '@reduxjs/toolkit'
import roomReducer from "./slices/room"

export default configureStore({
  reducer: {
    room: roomReducer,
  },
})