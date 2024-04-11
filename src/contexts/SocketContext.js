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
      const s = createSocket({
        options: {
          query: {
            userId,
            roomId,
          },
        },
      });
      s.on("connect", onConnect);
      s.on("disconnect", onDisconnect);
      s.on("reconnect", onReconnect);
      setSocket(s);
    },
    [onConnect, onDisconnect, onReconnect]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        initSocket,
        isConnected,
        isReconnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
