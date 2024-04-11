import { createSlice } from "@reduxjs/toolkit";
import { LOCALSTORAGE_KEY_USER_ID } from "../../constants"
import { v4 as uuid } from "uuid";

const userId = localStorage.getItem(LOCALSTORAGE_KEY_USER_ID);
if (!userId) {
  localStorage.setItem(LOCALSTORAGE_KEY_USER_ID, uuid())
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    data: {
      userId: userId,
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.data = {
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
