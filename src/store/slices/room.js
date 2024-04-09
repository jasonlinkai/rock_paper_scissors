import { createSlice } from "@reduxjs/toolkit";
import { getUrl } from "../../utils";

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

export const createCreateRoomActionWith =
  () =>
  async (dispatch) => {
    try {
      const response = await fetch(getUrl("/create-room"), {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data)
      dispatch(setRoom(data));
    } catch (error) {
      alert(error.message)
    }
  };

export const createEnterRoomActionWith =
  ({ roomId }) =>
  async (dispatch) => {
    try {
      const response = await fetch(getUrl("/enter-room"), {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
        }),
      });
      const data = await response.json();
      console.log(data)
      dispatch(setRoom(data));
    } catch (error) {
      alert(error.message)
    }
  };

export default roomSlice.reducer;
