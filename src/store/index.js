import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/user"
import roomReducer from "./slices/room"

export default configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
  },
})