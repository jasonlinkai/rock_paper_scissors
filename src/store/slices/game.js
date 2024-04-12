import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    data: {
      uid: "",
      roomId: "",
      userIds: [],
      isGaming: false,
    },
  },
  reducers: {
    setGame: (state, action) => {
      state.data = {
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGame } = gameSlice.actions;

export default gameSlice.reducer;
