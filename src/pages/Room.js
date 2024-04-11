import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSocketContext } from "../contexts/SocketContext";
import {
  MESAGE_TYPE_MSG,
  MESAGE_TYPE_GAME_RESULT,
  MESAGE_TYPE_START_GAME,
} from "../constants";

const Room = () => {
  const { socket, initSocket, isConnected } = useSocketContext();
  const userId = useSelector((state) => state.user.data.userId);
  const roomId = useSelector((state) => state.room.data.roomId);

  const onMsg = useCallback(() => {
    console.log("onMsg!");
  }, []);

  const onStartGame = useCallback(() => {
    console.log("onStartGame!");
  }, []);

  const onGameResult = useCallback(() => {
    console.log("onGameResult!");
  }, []);

  const onMessage = useCallback(
    ({ type, data }) => {
      console.log("message", type, data);
      switch (type) {
        case MESAGE_TYPE_MSG:
          onMsg(data);
          break;
        case MESAGE_TYPE_START_GAME:
          onStartGame(data);
          break;
        case MESAGE_TYPE_GAME_RESULT:
          onGameResult(data);
          break;
        default:
          break;
      }
    },
    [onMsg, onStartGame, onGameResult]
  );

  const applyRoomLogic = useCallback(
    (socket) => {
      socket.on("message", onMessage);
    },
    [onMessage]
  );

  const emitStartGame = useCallback(() => {
    socket.emit("startGame");
  }, [socket]);

  useEffect(() => {
    initSocket({ userId, roomId });
  }, [initSocket, userId, roomId]);

  useEffect(() => {
    if (socket) {
      applyRoomLogic(socket);
      socket.connect();
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, applyRoomLogic]);

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
        <button onClick={emitStartGame}>開始遊戲</button>
      </div>
    </div>
  );
};
export default Room;
