import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createCreateRoomActionWith,
  createEnterRoomActionWith,
} from "../store/slices/room";

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
    <div className="Home">
      <div>使用者ID: {userId}</div>
      <div>
        <h1>剪刀石頭布!</h1>
      </div>
      <div>
        <h2>創建新房間</h2>
        <button onClick={onCreateRoom}>創建</button>
      </div>
      <div>
        <h2>進入已存在的房間</h2>
        <input
          placeholder="請輸入房間號碼"
          onChange={(e) => _setRoomId(e.target.value)}
        />
        <button onClick={onEnterRoom}>進入</button>
      </div>
    </div>
  );
};
export default Home;
