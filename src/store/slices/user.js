import { createSlice } from "@reduxjs/toolkit";
import { LOCALSTORAGE_KEY_USER_ID } from "../../shared-utils/constants"
import { newUserId } from "../../shared-utils/id"

const userId = localStorage.getItem(LOCALSTORAGE_KEY_USER_ID);
if (!userId) {
  localStorage.setItem(LOCALSTORAGE_KEY_USER_ID, newUserId())
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    data: {
      userId: localStorage.getItem(LOCALSTORAGE_KEY_USER_ID),
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
