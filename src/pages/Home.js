import { useDispatch } from "react-redux";
import { createCreateRoomActionWith, createEnterRoomActionWith } from "../store/slices/room";
import { useState } from "react";

const Home = () => {
  const dispatch = useDispatch();
  const [roomId, setRoomId] = useState("");
  const onCreateRoom = () => {
    dispatch(
      createCreateRoomActionWith({
        roomId,
      })
    );
  };
  const onEnterRoom = () => {
    dispatch(
      createEnterRoomActionWith({
        roomId,
      })
    );
  };
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
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={onEnterRoom}>進入</button>
      </div>
    </div>
  );
};
export default Home;
