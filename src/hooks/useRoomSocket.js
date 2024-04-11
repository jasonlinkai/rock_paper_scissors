import { useEffect, useCallback } from "react";

const MESAGE_TYPE_MSG = 'MESAGE_TYPE_MSG'
const MESAGE_TYPE_START_GAME = 'MESAGE_TYPE_MSG'
const MESAGE_TYPE_GAME_RESULT = 'MESAGE_TYPE_GAME_RESULT'

const useRoomSocket = (socket) => {
  const onGameResult = useCallback((data) => {}, []);
  const onStartGame = useCallback((data) => {}, []);
  const onMsg = useCallback((data) => {}, []);

  const onMessage = useCallback(
    ({ type, data }) => {
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

  useEffect(() => {
    socket.on("message", onMessage);
  }, [socket, onMessage]);

  return socket;
};

export default useRoomSocket;
