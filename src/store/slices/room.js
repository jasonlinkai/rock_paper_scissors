import { createSlice } from "@reduxjs/toolkit";

export const roomSlice = createSlice({
  name: "room",
  initialState: {
    roomId: "",
  },
  reducers: {
    setRoom: (state, action) => {
      state = {
        ...state,
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRoom } = roomSlice.actions;

export default roomSlice.reducer;
