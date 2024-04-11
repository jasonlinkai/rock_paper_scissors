import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createCreateRoomActionWith,
  createEnterRoomActionWith,
} from "../store/slices/room";
import { setUser } from "../store/slices/user";
import { v4 as uuid } from "uuid";
import useAuth from "../hooks/useAuth"

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();
  const [_roomId, _setRoomId] = useState("");
  const onEnterSuccess = () => {
    dispatch(
      setUser({
        userId: uuid(),
      })
    );
  };
  const onCreateRoom = async () => {
    const data = await dispatch(createCreateRoomActionWith());
    if (data) {
      onEnterSuccess();
    }
  };
  const onEnterRoom = async () => {
    const data = await dispatch(
      createEnterRoomActionWith({
        roomId: _roomId,
      })
    );
    if (data) {
      onEnterSuccess();
    }
  };
  useEffect(() => {
    if (auth) {
      navigate("/room");
    }
  }, [auth, navigate]);
  return (
    <div className="Home">
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
