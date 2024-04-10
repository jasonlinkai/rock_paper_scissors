import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { createSocket } from "../socket";
import {
  onSocketConnected,
  onSocketDisconnected,
} from "../store/slices/socket";

const Room = () => {
  const socketRef = useRef();
  const isConnected = useSelector((state) => state.socket.data.isConnected);
  const userId = useSelector((state) => state.user.data.userId);
  const roomId = useSelector((state) => state.room.data.roomId);

  const onSocketReceivedMessage = useCallback(() => {}, []);

  const onStartGame = () => {
    socketRef.current.emit({
      type: 'startGame',
    })
  };

  const handler = useCallback(
    ({ type, data }) => {
      switch (type) {
        case "connect":
          onSocketConnected();
          break;
        case "message":
          onSocketReceivedMessage(type, data);
          break;
        case "disconnect":
          onSocketDisconnected();
          break;
        default:
          break;
      }
    },
    [onSocketReceivedMessage]
  );
  useEffect(() => {
    socketRef.current = createSocket({
      emit: handler,
    });
    socketRef.current.connect();
    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [handler]);

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
