import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import useSocket from "../hooks/useSocket";
import useRoomSocket from "../hooks/useRoomSocket";

const Room = () => {
  const isConnected = useSelector((state) => state.socket.data.isConnected);
  const userId = useSelector((state) => state.user.data.userId);
  const roomId = useSelector((state) => state.room.data.roomId);
  const s = useSocket({ userId, roomId });
  const socket = useRoomSocket(s);

  const onStartGame = useCallback(() => {
    socket.emit("startGame");
  }, [socket]);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="Room">
      <div>{isConnected ? "連線成功" : "連線中"}</div>
      <div>
        <h1>剪刀石頭布!</h1>
      </div>
      <div>
        <h2>用戶ID: {userId}</h2>
        <h2>房間ID: {roomId}</h2>
      </div>
      <div>
        <button onClick={onStartGame}>開始遊戲</button>
      </div>
    </div>
  );
};
export default Room;
