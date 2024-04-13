import React, {
  createContext,
  useContext,
  useCallback,
  useState,
} from "react";
import { createSocket } from "../socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnected, setIsReconnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onConnectError = useCallback((error) => {
    console.log("connect_error!", error.message);
    setErrorMsg(error.message)
  }, []);

  const onConnect = useCallback(() => {
    console.log("connect!");
    setIsConnected(true);
    setIsReconnected(false);
  }, []);

  const onDisconnect = useCallback(() => {
    console.log("disconnect!");
    setIsConnected(false);
  }, []);

  const onReconnect = useCallback((attemptNumber) => {
    console.log(`onReconnect! times: ${attemptNumber}`);
    setIsReconnected(true);
  }, []);

  const initSocket = useCallback(
    ({ userId, roomId }) => {
      setErrorMsg('')
      const s = createSocket({
        options: {
          query: {
            userId,
            roomId,
          },
        },
      });
      s.on('connect_error', onConnectError);
      s.on("connect", onConnect);
      s.on("disconnect", onDisconnect);
      s.on("reconnect", onReconnect);
      setSocket(s);
    },
    [onConnectError, onConnect, onDisconnect, onReconnect]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        initSocket,
        isConnected,
        isReconnected,
        errorMsg,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
