import { createSlice } from "@reduxjs/toolkit";
import { getServerUrl } from "../../utils/http";

export const roomSlice = createSlice({
  name: "room",
  initialState: {
    data: {
      uid: '',
      userIds: [],
      locked: false,
      raisedIds: [],
      raisedRecord: {},
    },
  },
  reducers: {
    setRoom: (state, action) => {
      state.data = {
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRoom } = roomSlice.actions;

export const createCreateRoomActionWith =
  ({
    userId,
  }) =>
  async (dispatch) => {
    try {
      const response = await fetch(getServerUrl("/create-room"), {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
      const data = await response.json();
      dispatch(setRoom(data));
      return data;
    } catch (error) {
      return null;
    }
  };

export const createEnterRoomActionWith =
  ({ userId, roomId }) =>
  async (dispatch) => {
    try {
      const response = await fetch(getServerUrl("/enter-room"), {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          roomId,
        }),
      });
      const data = await response.json();
      dispatch(setRoom(data));
      return data;
    } catch (error) {
      return null;
    }
  };

export default roomSlice.reducer;
