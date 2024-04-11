import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createCreateRoomActionWith,
  createEnterRoomActionWith,
} from "../store/slices/room";
import Page from "../container/Page";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.data.userId);
  const [_roomId, _setRoomId] = useState("");
  const onEnter = () => {
    navigate("/room");
  };
  const onCreateRoom = async () => {
    const data = await dispatch(
      createCreateRoomActionWith({
        userId,
      })
    );
    if (!data) {
      alert("創建房間失敗");
    } else {
      onEnter();
    }
  };
  const onEnterRoom = async () => {
    if (!_roomId) {
      alert("請先輸入房間號碼");
      return;
    }
    const data = await dispatch(
      createEnterRoomActionWith({
        userId,
        roomId: _roomId,
      })
    );
    if (!data) {
      alert("找不到此房間");
    } else {
      onEnter();
    }
  };
  return (
    <Page>
      <div className="absolute w-60 h-60 rounded-xl bg-blue-300 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
      <div className="absolute w-48 h-48 rounded-xl bg-blue-300 -bottom-6 -right-10 transform rotate-12 hidden md:block"></div>
      <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
        <div>
          <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
            剪刀、石頭、布
          </h1>
          <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide">
            線上即時猜拳遊戲，找朋友來PK吧!
          </p>
          <p className="w-80 text-center text-sm mb-2 font-semibold text-gray-700 tracking-wide">
            您的使用者ID
          </p>
          <p className="w-80 text-sm mb-8 font-semibold text-gray-700 tracking-wide">
            {userId}
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="直接點擊或輸入房間號碼進入"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-blue-500"
            onChange={(e) => _setRoomId(e.target.value)}
          />
        </div>
        <div className="mt-6 text-center">
          <button
            className="w-full py-2 text-sm text-white bg-blue-400 rounded-lg hover:bg-blue-500 transition-all"
            onClick={_roomId ? onEnterRoom : onCreateRoom}
          >
            進入房間
          </button>
        </div>
      </div>
      <div className="w-40 h-40 absolute bg-blue-300 rounded-full top-0 right-12 hidden md:block"></div>
      <div className="w-20 h-40 absolute bg-blue-300 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
    </Page>
  );
};
export default Home;
