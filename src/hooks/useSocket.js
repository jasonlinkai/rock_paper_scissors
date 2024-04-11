import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { createSocket } from "../socket";
import {
  onSocketConnected,
  onSocketDisconnected,
} from "../store/slices/socket";

const useSocket = ({ userId, roomId }) => {
  const dispatch = useDispatch();
  const ref = useRef(
    createSocket({
      options: {
        query: {
          userId,
          roomId,
        },
      }
    })
  );

  const onConnect = useCallback(() => {
    dispatch(onSocketConnected());
  }, [dispatch]);

  const onDisconnect = useCallback(() => {
    dispatch(onSocketDisconnected());
  }, [dispatch]);

  useEffect(() => {
    ref.current.on("connect", onConnect);
    ref.current.on("disconnect", onDisconnect);
  }, [onConnect, onDisconnect]);

  return ref.current;
};

export default useSocket;
