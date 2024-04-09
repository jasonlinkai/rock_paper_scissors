import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createCreateRoomActionWith,
  createEnterRoomActionWith,
} from "../store/slices/room";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roomId = useSelector((state) => state.room.roomId);
  const [_roomId, _setRoomId] = useState("");
  const onCreateRoom = () => {
    dispatch(createCreateRoomActionWith());
  };
  const onEnterRoom = () => {
    dispatch(
      createEnterRoomActionWith({
        roomId: _roomId,
      })
    );
  };
  useEffect(() => {
    navigate('/room')
  }, [navigate, roomId]);
  return (
    <div className="Home">
      <div>
        <h1>剪刀石頭布!{roomId}</h1>
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
