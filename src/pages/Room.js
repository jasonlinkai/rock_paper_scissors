import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSocketContext } from "../contexts/SocketContext";
import { events } from "../constants";

const Room = () => {
  const { socket, initSocket, isConnected } = useSocketContext();
  const userId = useSelector((state) => state.user.data.userId);
  const roomId = useSelector((state) => state.room.data.roomId);

  const onMessageAdded = useCallback(() => {}, []);
  const onMemberAdded = useCallback(() => {}, []);
  const onMemberLeaved = useCallback(() => {}, []);
  const onGameStarted = useCallback(() => {}, []);
  const onGameEnded = useCallback(() => {}, []);

  const onMessage = useCallback(
    (data) => {
      console.log("onMessage!", data);
      switch (data.type) {
        case events.MESSAGE_ADDED:
          onMessageAdded(data);
          break;
        case events.MEMBER_ADDED:
          onMemberAdded(data);
          break;
        case events.MEMBER_LEAVED:
          onMemberLeaved(data);
          break;
        case events.GAME_STARTED:
          onGameStarted(data);
          break;
        case events.GAME_ENDED:
          onGameEnded(data);
          break;
        default:
          break;
      }
    },
    [onMessageAdded, onMemberAdded, onMemberLeaved, onGameStarted, onGameEnded]
  );

  const applyRoomLogic = useCallback(
    (socket) => {
      socket.on("message", onMessage);
    },
    [onMessage]
  );

  const emitStartGame = useCallback(() => {
    socket.emit(events.GAME_START);
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
