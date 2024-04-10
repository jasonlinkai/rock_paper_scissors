import { configureStore } from '@reduxjs/toolkit'
import socketReducer from "./slices/socket"
import userReducer from "./slices/user"
import roomReducer from "./slices/room"

export default configureStore({
  reducer: {
    socket: socketReducer,
    user: userReducer,
    room: roomReducer,
  },
})